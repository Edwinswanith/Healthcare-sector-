"use client";

import { useEffect, useRef } from "react";

/**
 * Hero portrait: AI-generated clinician rendered in WebGL.
 *  - matte alpha so the giant headline sits behind the subject
 *  - depth map drives a mouse parallax "head turn"
 *  - a fluid cursor trail (2D canvas uploaded as a texture) reveals an
 *    aligned X-ray anatomy layer, with a signal-red rim on the edge
 *  - `--reveal` on the host element (set by scroll) opens the anatomy fully
 * Touch / no-hover devices get an automatic blob path. Reduced motion and
 * no-WebGL fall back to the static <img> that is already in the markup.
 */

const VERT = `attribute vec2 p;varying vec2 v;void main(){v=p*.5+.5;gl_Position=vec4(p,0.,1.);}`;

const FRAG = `precision highp float;
varying vec2 v;
uniform sampler2D uP,uA,uD,uT;
uniform vec2 uRes,uMouse;
uniform vec4 uRect;      // image rect in px: x,y(top),w,h
uniform float uTime,uReveal,uZoom;
float h(vec2 p){return fract(sin(dot(p,vec2(127.1,311.7)))*43758.5453);}
float n(vec2 p){vec2 i=floor(p),f=fract(p);f=f*f*(3.-2.*f);
  return mix(mix(h(i),h(i+vec2(1,0)),f.x),mix(h(i+vec2(0,1)),h(i+vec2(1,1)),f.x),f.y);}
float fbm(vec2 p){return n(p)*.55+n(p*2.1)*.3+n(p*4.3)*.15;}
void main(){
  vec2 px=vec2(v.x,1.-v.y)*uRes;
  // zoom about the bottom centre of the image rect
  vec2 anchor=vec2(uRect.x+uRect.z*.5,uRect.y+uRect.w);
  px=anchor+(px-anchor)/uZoom;
  vec2 uv=(px-uRect.xy)/uRect.zw;
  if(uv.x<0.||uv.x>1.||uv.y<0.||uv.y>1.){gl_FragColor=vec4(0);return;}
  float d=texture2D(uD,uv).r;
  vec2 uv2=uv-uMouse*vec2(.016,.010)*(d-.35);
  vec4 dm=texture2D(uD,uv2);
  float matte=smoothstep(.35,.75,dm.g);
  if(matte<.003){gl_FragColor=vec4(0);return;}
  vec3 por=texture2D(uP,uv2).rgb;
  vec3 ana=texture2D(uA,uv2).rgb;
  // X-ray treatment: inverted luminance as cool ghost, red channel as glowing vessels
  float lum=dot(ana,vec3(.299,.587,.114));
  float red=clamp((ana.r-(ana.g+ana.b)*.5-.13)*3.4,0.,1.);
  vec3 ink=vec3(.051,.082,.141);
  vec3 xr=ink+vec3(.36,.66,.8)*pow(1.-lum,1.4)*1.5+vec3(1.,.36,.22)*red*1.6;
  // reveal mask: cursor trail + scroll sweep from the chest, both noise-edged
  vec2 sv=gl_FragCoord.xy/uRes;
  float t=texture2D(uT,sv).r;
  float nz=fbm(uv*vec2(7.,4.)+vec2(0.,uTime*.25));
  float sweep=uReveal*1.5-(1.-uv.y)*.9+(.5-abs(uv.x-.5))*.25;
  float m=max(t*1.15,sweep)+(nz-.5)*.38;
  float a=smoothstep(.42,.5,m);
  float rim=smoothstep(.36,.46,m)-smoothstep(.46,.56,m);
  vec3 col=mix(por,xr,a)+vec3(.9,.28,.18)*rim*1.3;
  // scanline shimmer inside the X-ray
  col+=a*vec3(.05,.1,.12)*step(.5,fract(px.y*.25+uTime*2.))*.5;
  gl_FragColor=vec4(col*matte,matte);
}`;

type Props = { className?: string };

export function HeroPortraitGL({ className = "" }: Props) {
  const host = useRef<HTMLDivElement>(null);
  const cv = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const el = host.current, canvas = cv.current;
    if (!el || !canvas) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const gl = canvas.getContext("webgl", { premultipliedAlpha: true, alpha: true, antialias: false });
    if (!gl) return;

    const sh = (type: number, src: string) => {
      const s = gl.createShader(type)!;
      gl.shaderSource(s, src);
      gl.compileShader(s);
      return s;
    };
    const prog = gl.createProgram()!;
    gl.attachShader(prog, sh(gl.VERTEX_SHADER, VERT));
    gl.attachShader(prog, sh(gl.FRAGMENT_SHADER, FRAG));
    gl.linkProgram(prog);
    if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) return;
    gl.useProgram(prog);
    const buf = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buf);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]), gl.STATIC_DRAW);
    const loc = gl.getAttribLocation(prog, "p");
    gl.enableVertexAttribArray(loc);
    gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);
    const U = (n: string) => gl.getUniformLocation(prog, n);
    const u = { res: U("uRes"), mouse: U("uMouse"), rect: U("uRect"), time: U("uTime"), reveal: U("uReveal"), zoom: U("uZoom") };

    const mkTex = (unit: number, name: string) => {
      const t = gl.createTexture()!;
      gl.activeTexture(gl.TEXTURE0 + unit);
      gl.bindTexture(gl.TEXTURE_2D, t);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
      gl.uniform1i(U(name), unit);
      return t;
    };
    const small = window.innerWidth < 900;
    const srcs: [string, string][] = [
      ["uP", small ? "/media/hero/portrait-1280.webp" : "/media/hero/portrait.webp"],
      ["uA", small ? "/media/hero/anatomy-1280.webp" : "/media/hero/anatomy.webp"],
      ["uD", "/media/hero/dm.webp"],
    ];
    const texs = srcs.map(([n], i) => mkTex(i, n));
    const trailTex = mkTex(3, "uT");

    // Fluid trail buffer at low resolution
    const trail = document.createElement("canvas");
    const tctx = trail.getContext("2d")!;
    let loaded = 0;
    let disposed = false;
    srcs.forEach(([, src], i) => {
      const img = new Image();
      img.decoding = "async";
      img.onload = () => {
        if (disposed) return;
        gl.activeTexture(gl.TEXTURE0 + i);
        gl.bindTexture(gl.TEXTURE_2D, texs[i]);
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, img);
        if (++loaded === srcs.length) el.classList.add("is-gl");
      };
      img.src = src;
    });

    let W = 0, H = 0;
    const IMG_AR = 2752 / 1536;
    const rect = [0, 0, 0, 0];
    const resize = () => {
      const r = el.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, small ? 1.5 : 1.75);
      W = Math.max(1, Math.round(r.width * dpr));
      H = Math.max(1, Math.round(r.height * dpr));
      canvas.width = W;
      canvas.height = H;
      gl.viewport(0, 0, W, H);
      // Desktop: fit height (subject fills the stage). Portrait screens: subject ~ full width.
      let iw: number, ih: number;
      if (W / H > 1) { ih = H * 0.84; iw = ih * IMG_AR; }
      else { iw = W * 2.6; ih = iw / IMG_AR; }
      rect[0] = (W - iw) / 2; rect[1] = H - ih; rect[2] = iw; rect[3] = ih;
      trail.width = Math.max(64, Math.round(W / 6));
      trail.height = Math.max(64, Math.round(H / 6));
      tctx.fillStyle = "#000";
      tctx.fillRect(0, 0, trail.width, trail.height);
    };
    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(el);

    const hover = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
    const ptr = { x: 0.5, y: 0.4, px: 0.5, py: 0.4, nx: 0, ny: 0, active: false, last: 0 };
    const mouse = { x: 0, y: 0 };
    const onMove = (e: PointerEvent) => {
      const r = el.getBoundingClientRect();
      ptr.x = (e.clientX - r.left) / r.width;
      ptr.y = (e.clientY - r.top) / r.height;
      ptr.nx = ptr.x * 2 - 1;
      ptr.ny = ptr.y * 2 - 1;
      ptr.active = ptr.x >= 0 && ptr.x <= 1 && ptr.y >= 0 && ptr.y <= 1;
      ptr.last = performance.now();
    };
    window.addEventListener("pointermove", onMove, { passive: true });

    const stamp = (x: number, y: number, rad: number, a: number) => {
      const X = x * trail.width, Y = y * trail.height, R = rad * trail.height;
      const g = tctx.createRadialGradient(X, Y, 0, X, Y, R);
      g.addColorStop(0, `rgba(255,255,255,${a})`);
      g.addColorStop(1, "rgba(255,255,255,0)");
      tctx.fillStyle = g;
      tctx.fillRect(X - R, Y - R, R * 2, R * 2);
    };

    let visible = true;
    const io = new IntersectionObserver(([e]) => (visible = e.isIntersecting));
    io.observe(el);

    const t0 = performance.now();
    let raf = 0;
    const frame = (now: number) => {
      raf = requestAnimationFrame(frame);
      if (!visible || loaded < srcs.length) return;
      const t = (now - t0) / 1000;
      // fade the trail so the reveal closes behind the cursor
      tctx.globalCompositeOperation = "source-over";
      tctx.fillStyle = "rgba(0,0,0,0.045)";
      tctx.fillRect(0, 0, trail.width, trail.height);
      tctx.globalCompositeOperation = "lighter";
      const idle = !hover || now - ptr.last > 4000;
      if (idle) {
        // autonomous lissajous blob over the chest and face: discovery on touch
        const ax = 0.5 + Math.sin(t * 0.55) * 0.13 + Math.sin(t * 1.3) * 0.04;
        const ay = 0.58 + Math.cos(t * 0.42) * 0.2;
        stamp(ax, ay, 0.12, 0.16);
      } else if (ptr.active) {
        const steps = Math.min(12, Math.ceil(Math.hypot(ptr.x - ptr.px, ptr.y - ptr.py) * 60) + 1);
        for (let i = 1; i <= steps; i++) {
          const k = i / steps;
          stamp(ptr.px + (ptr.x - ptr.px) * k, ptr.py + (ptr.y - ptr.py) * k, 0.11, 0.2);
        }
      }
      ptr.px = ptr.x;
      ptr.py = ptr.y;
      mouse.x += ((hover ? ptr.nx : Math.sin(t * 0.4) * 0.6) - mouse.x) * 0.06;
      mouse.y += ((hover ? ptr.ny : Math.cos(t * 0.3) * 0.3) - mouse.y) * 0.06;

      gl.activeTexture(gl.TEXTURE3);
      gl.bindTexture(gl.TEXTURE_2D, trailTex);
      gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, trail);
      const cs = getComputedStyle(el);
      const reveal = parseFloat(cs.getPropertyValue("--reveal")) || 0;
      const zoom = parseFloat(cs.getPropertyValue("--zoom")) || 1;
      gl.uniform2f(u.res, W, H);
      gl.uniform2f(u.mouse, mouse.x, mouse.y);
      gl.uniform4f(u.rect, rect[0], rect[1], rect[2], rect[3]);
      gl.uniform1f(u.time, t);
      gl.uniform1f(u.reveal, reveal);
      gl.uniform1f(u.zoom, zoom);
      gl.clearColor(0, 0, 0, 0);
      gl.clear(gl.COLOR_BUFFER_BIT);
      gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
    };
    raf = requestAnimationFrame(frame);

    return () => {
      disposed = true;
      cancelAnimationFrame(raf);
      ro.disconnect();
      io.disconnect();
      window.removeEventListener("pointermove", onMove);
      gl.getExtension("WEBGL_lose_context")?.loseContext();
    };
  }, []);

  return (
    <div ref={host} className={`hero-gl ${className}`} aria-hidden="true">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img className="hero-gl__still" src="/media/hero/portrait-cut.webp" alt="" />
      <canvas ref={cv} className="hero-gl__cv" />
    </div>
  );
}
