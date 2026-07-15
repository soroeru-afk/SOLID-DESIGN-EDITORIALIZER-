/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useRef, useCallback, useEffect } from 'react';
import { motion, AnimatePresence, LayoutGroup } from 'motion/react';
import { toPng } from 'html-to-image';
import { 
  FileUp,
  FileDown,
  Upload, 
  Image as ImageIcon, 
  Download, 
  Grid,
  Type,
  LayoutTemplate,
  Layers,
  LayoutGrid,
  Settings2,
  Save,
  RotateCcw,
  Trash2,
  X,
  ChevronLeft,
  ChevronRight,
  ChevronUp,
  ChevronDown,
  Settings,
  Maximize,
  Shrink,
  Palette
} from 'lucide-react';

type Orientation = 'horizontal' | 'vertical';
type LayoutStyle = 'impact' | 'story' | 'gallery' | 'split' | 'magazine' | 'blank';

const DEFAULT_IMAGE = "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80";


const FONT_OPTIONS = [
  { value: '', label: 'AUTO' },
  { value: 'Meiryo, sans-serif', label: 'MEIRYO (メイリオ)' },
  { value: '"Yu Gothic", "YuGothic", "Hiragino Kaku Gothic ProN", "Hiragino Sans", sans-serif', label: 'STANDARD GOTHIC (ゴシック体)' },
  { value: '"M PLUS Rounded 1c", sans-serif', label: 'ROUNDED GOTHIC (丸ゴシック)' },
  { value: '"Zen Maru Gothic", sans-serif', label: 'ZEN MARU GOTHIC' },
  { value: '"Dela Gothic One", sans-serif', label: 'DELA GOTHIC' },
  { value: '"Train One", sans-serif', label: 'TRAIN ONE' },
  { value: '"Reggae One", sans-serif', label: 'REGGAE ONE' },
  { value: '"DotGothic16", sans-serif', label: 'DOT GOTHIC' },
  { value: '"M PLUS 1p", sans-serif', label: 'M PLUS 1P' },
  { value: '"Noto Sans JP", sans-serif', label: 'NOTO SANS' },
  { value: '"Noto Serif JP", serif', label: 'NOTO SERIF' },
  { value: '"Shippori Mincho", serif', label: 'SHIPPORI' },
  { value: '"Zen Dots", sans-serif', label: 'ZEN DOTS' }
];

const DEFAULT_KICKER = "VOL.04 THE PERSPECTIVE";
const DEFAULT_HEADING = "視線の\nアルゴリズム";
const DEFAULT_BODY = "私たちは常に何かを見ているようで、実は何も見ていない。\n情報が溢れる世界で、本当に必要なものはノイズの奥に隠されている。\n\nフォーマットを変え、視点を切り替える。\nそれだけで、日常はドラマチックなシーンへと変貌するのだ。";
const DEFAULT_META1 = "TYPOGRAPHY STUDY";
const DEFAULT_META2 = "SEP. 2026 // TOKYO";

const DraggableBlock = ({ 
  id, 
  className, 
  isEditMode, 
  gridMode,
  offset, 
  onDragEnd, 
  children,
  spring,
  style = {},
  scale = 1,
  rotate = 0,
  width,
  height,
  isSelected = false,
  isHidden = false,
  centerOrigin = false,
  onClick
}: any) => {
  const isEdit = isEditMode;
  const gridColor = gridMode === 'cyan' ? '#00ffff' : (gridMode === 'dark' ? '#333333' : (gridMode === 'light' ? '#e2e8f0' : 'transparent'));
  const frameColor = gridMode === 'cyan' ? '#888888' : (gridMode === 'dark' ? '#3b82f6' : (gridMode === 'light' ? '#22c55e' : 'transparent'));

  // Determine z-index based on state and style
  const currentZIndex = isSelected ? 9999 : style.zIndex;

  return (
    <motion.div
        id={id}
        onClick={onClick}
        className={`${className} ${isEdit ? 'ring-2 cursor-move' : ''} ${isSelected ? 'ring-4 ring-red-500 shadow-[0_0_15px_rgba(239,68,68,0.5)]' : ''}`}
        transition={spring}
        drag={isEdit}
        dragMomentum={false}
        onDragEnd={(e, info) => {
          onDragEnd(id, info.offset.x, info.offset.y);
        }}
        animate={{ x: offset.x, y: offset.y, scale, rotate }}
        whileDrag={{ zIndex: 10000 }}
        style={{
          transformOrigin: centerOrigin ? '50% 50%' : '0 0',
          ...style,
          display: isHidden ? 'none' : style.display,
          ...(width !== undefined ? { width: `${width}px` } : {}),
          ...(height !== undefined ? { height: `${height}px` } : {}),
          ...(currentZIndex !== undefined ? { zIndex: currentZIndex } : {}),
          ...(isEdit ? { 
            touchAction: 'none',
            '--tw-ring-color': isSelected ? 'rgb(239, 68, 68)' : frameColor
          } : {}) 
        } as any}
      >
      {children}
    </motion.div>
  );
};

function getLayoutConfig(pattern: LayoutStyle, orient: Orientation) {
  const isV = orient === 'vertical';
  
  const base = {
    fontFamily: isV ? "var(--font-serif)" : "var(--font-sans)",
  };

  const c = {
    container: "",
    bgWrapper: "",
    bgWrapper2: "hidden ",
    image: "w-full h-full object-cover ",
    image2: "w-full h-full object-cover ",
    contentWrapper: "absolute inset-0 pointer-events-none ",
    kicker: "absolute font-bold text-[14px]",
    titleContainer: "absolute flex",
    titleLine: "font-black drop-shadow-md",
    bodyContainer: "absolute flex",
    bodyLine: "text-[14px] leading-[2.4] font-medium text-opacity-90",
    body2Container: "absolute flex",
    body2Line: "text-[14px] leading-[2.4] font-medium text-opacity-90",
    meta1: "absolute font-mono text-[12px] tracking-widest",
    meta2: "absolute font-mono text-[12px] tracking-widest",
    accent1: "absolute",
    accent2: "absolute",
  };

  // Base adjustments based on orientation
  if (isV) {
    c.titleContainer += " writing-vertical-rl flex-col items-start gap-4"; // flex-col flows Right-to-Left in vertical-rl
    c.bodyContainer += " writing-vertical-rl flex-col gap-6";
    c.body2Container += " writing-vertical-rl flex-col gap-6";
    c.titleLine += " tracking-[0.3em] leading-[1.2]";
    c.bodyLine += " tracking-[0.2em] transform origin-top-right";
    c.body2Line += " tracking-[0.2em] transform origin-top-right";
  } else {
    c.titleContainer += " flex-col";
    c.bodyContainer += " flex-col gap-6 text-justify";
    c.body2Container += " flex-col gap-6 text-justify";
    c.titleLine += " tracking-tight leading-[1.1]";
    c.bodyLine += " tracking-[0.1em]";
    c.body2Line += " tracking-[0.1em]";
  }

  if (pattern === 'impact') {
    c.container = "bg-[#0a0a0a] text-white w-full h-full relative overflow-hidden";
    c.bgWrapper = "absolute inset-0 z-0";
    c.bgWrapper2 = "absolute z-0 " + (isV ? "w-[400px] h-[300px] bottom-[100px] right-[100px]" : "w-[300px] h-[400px] left-[100px] bottom-[100px]");
    c.image += " scale-105";
    c.image2 += " drop-shadow-2xl";
    c.kicker += " text-red-500 tracking-[0.4em] top-16 right-16";
    c.titleContainer += isV ? " right-[160px] top-[120px] h-[600px] justify-center" : " top-[160px] left-1/2 -translate-x-1/2 whitespace-nowrap text-center text-white";
    c.titleLine += isV ? " text-[96px] text-white" : " text-[110px] text-white";
    c.bodyContainer += isV ? " left-[80px] top-[120px] h-[600px] w-[260px] flex-col items-start" : " right-24 bottom-16 w-[480px] ";
    c.body2Container += isV ? " left-[380px] bottom-[120px] h-[300px]" : " left-24 top-16 w-[300px]";
    c.bodyLine += " text-white";
    c.body2Line += " text-white/70";
    c.meta1 += " text-white/50 bottom-16 left-16";
    c.meta2 += " text-white/50 top-16 left-16";
    c.accent1 += " bg-red-600 " + (isV ? "w-[12px] h-[300px] bottom-0 left-[200px]" : "h-[12px] w-[300px] top-0 left-[300px]");
    c.accent2 += " border border-white/10 " + (isV ? "w-[1200px] h-[1px] top-[450px]" : "h-[900px] w-[1px] left-[600px]");
  } 
  else if (pattern === 'story') {
    c.container = "bg-[#f4f1ea] text-[#1a1a1a] w-full h-full relative overflow-hidden";
    c.bgWrapper = "absolute z-0 " + (isV ? "w-[500px] h-full right-0 top-0" : "w-[600px] h-[900px] top-0 left-0");
    c.bgWrapper2 = "absolute z-10 drop-shadow-md " + (isV ? "w-[300px] h-[400px] left-[100px] top-[100px]" : "w-[400px] h-[300px] right-[100px] bottom-[100px]");
    c.image += " drop-shadow-2xl";
    c.image2 += " drop-shadow-sm grayscale";
    c.kicker += " text-[#d94a38] tracking-[0.2em] " + (isV ? "left-16 bottom-16 border-b-[3px] border-red-500 pb-2 border-l-0 pl-0" : "left-[680px] top-24 border-l-[3px] border-red-500 pl-4");
    c.titleContainer += isV ? " left-[360px] top-[80px] h-[600px]" : " left-[680px] top-[140px]";
    c.titleLine += isV ? " text-[72px]" : " text-[70px]";
    // Use block layout with actual css columns
    const baseBody = c.bodyContainer.replace('flex ', 'block ').replace('flex-col ', '').replace('gap-6', '');
    c.bodyContainer = baseBody + (isV ? " left-[60px] top-[80px] h-[650px] w-[260px] columns-2 gap-10" : " left-[680px] top-[380px] w-[440px] columns-2 gap-10");
    c.body2Container = baseBody + (isV ? " left-[360px] bottom-[80px] h-[200px]" : " left-[680px] bottom-[140px] w-[440px]");
    c.bodyLine += " text-[#444] text-justify mb-5 inline-block w-full"; 
    c.body2Line += " text-[#666] text-sm";
    c.meta1 += " text-[#999] " + (isV ? "top-16 left-16 writing-vertical-rl" : "bottom-16 right-16");
    c.meta2 += " text-[#999] " + (isV ? "top-16 right-[540px]" : "top-[250px] right-16");
    c.accent1 += " bg-[#222] " + (isV ? "w-[1px] h-[300px] top-[180px] left-[300px]" : "h-[1px] w-[200px] top-[320px] left-[680px]");
    c.accent2 += " bg-[#080a0d]/5 " + (isV ? "w-[1px] h-[900px] left-[500px]" : "w-[1200px] h-[1px] top-[600px]");
  }
  else if (pattern === 'gallery') {
    c.container = "bg-white text-[#222] w-full h-full relative overflow-hidden";
    c.bgWrapper = "absolute z-10 drop-shadow-2xl " + (isV ? "top-[120px] right-[300px] w-[450px] h-[650px]" : "top-[80px] left-1/2 -translate-x-1/2 w-[580px] h-[400px]");
    c.bgWrapper2 = "absolute z-20 drop-shadow-xl " + (isV ? "bottom-[80px] left-[200px] w-[300px] h-[400px]" : "bottom-[200px] left-[100px] w-[350px] h-[250px]");
    c.image += " contrast-[1.05] saturate-[0.9]";
    c.kicker += " text-[#999] tracking-[0.4em] " + (isV ? "top-16 right-16" : "top-16 left-16");
    c.titleContainer += isV ? " left-[140px] top-[160px] h-[600px]" : " top-[500px] left-1/2 -translate-x-1/2 w-full text-center";
    c.titleLine += isV ? " text-[64px]" : " text-[54px]";
    
    // Gallery Body (Columns for horizontal, regular for vertical)
    const baseBody = c.bodyContainer.replace('flex ', isV ? 'flex ' : 'block ').replace('flex-col ', '');
    c.bodyContainer = baseBody + (isV ? " left-[50px] bottom-[120px] h-[500px]" : " top-[660px] left-1/2 -translate-x-1/2 w-[800px] columns-2 gap-16");
    c.body2Container = baseBody + (isV ? " left-[300px] top-[120px] h-[250px]" : " top-[660px] left-24 w-[250px]");
    c.bodyLine += " text-[#666]" + (isV ? "" : " text-center inline-block w-full text-justify mb-5");
    c.body2Line += " text-[#888] text-xs italic";
    
    c.meta1 += " text-[#bbb] " + (isV ? "bottom-16 right-16" : "bottom-16 left-16");
    c.meta2 += " text-[#bbb] " + (isV ? "bottom-16 left-[220px]" : "bottom-16 right-16");
    c.accent1 += " bg-[#222] " + (isV ? "w-[1px] h-[200px] top-[120px] left-[100px]" : "h-[1px] w-[200px] top-[640px] left-[400px]");
    c.accent2 += " bg-[#f0f0f0] z-0 " + (isV ? "w-[500px] h-[900px] right-0" : "w-[1200px] h-[400px] top-0");
  }
  else if (pattern === 'magazine') {
    c.container = "bg-[#e8ecef] text-[#0a1128] w-full h-full relative overflow-hidden";
    c.bgWrapper = "absolute z-10 " + (isV ? "top-[80px] left-[450px] w-[600px] h-[740px]" : "top-[100px] right-[80px] w-[680px] h-[700px]");
    c.bgWrapper2 = "absolute z-20 " + (isV ? "bottom-[120px] left-[200px] w-[250px] h-[350px]" : "bottom-[80px] right-[800px] w-[300px] h-[400px]");
    c.image += " drop-shadow-xl";
    c.titleContainer += " z-20 mix-blend-hard-light " + (isV ? "right-[120px] top-[80px] h-[800px]" : "top-[80px] left-[80px]");
    c.titleLine += isV ? " text-[100px] text-red-600" : " text-[120px] text-white";
    c.bodyContainer += " z-20 " + (isV ? "left-[140px] top-[160px] h-[500px]" : "top-[480px] left-[80px] w-[440px]");
    c.body2Container += " z-20 " + (isV ? "left-[360px] top-[160px] h-[400px]" : "top-[480px] left-[560px] w-[200px]");
    c.bodyLine += " text-[#0a1128]";
    c.body2Line += " text-[#0a1128]/80 font-bold";
    c.kicker += " text-white absolute z-20 bg-[#080a0d] px-4 py-2 " + (isV ? "top-[80px] left-[520px]" : "top-[680px] left-[720px]");
    c.meta1 += " text-[#0a1128] font-bold " + (isV ? "bottom-[120px] right-[240px]" : "bottom-[80px] left-[80px]");
    c.meta2 += " text-white/80 z-20 " + (isV ? "bottom-[120px] left-[480px]" : "bottom-[80px] right-[100px]");
    c.accent1 += " bg-red-600 z-20 " + (isV ? "w-[600px] h-[4px] bottom-[100px] left-[450px]" : "h-[600px] w-[4px] left-[100px] top-[100px]");
    c.accent2 += " hidden";
  }
  else if (pattern === 'blank') {
    c.container = "bg-white text-black w-full h-full relative overflow-hidden";
    c.bgWrapper = "absolute z-0 w-[400px] h-[400px] top-[100px] left-1/2 -translate-x-1/2";
    c.bgWrapper2 = "absolute z-0 w-[300px] h-[300px] top-[550px] left-[100px]";
    c.titleContainer += " z-10 top-10 left-10";
    c.bodyContainer += " z-10 bottom-10 left-10 " + (isV ? "h-[300px]" : "w-[300px]");
    c.body2Container += " z-10 bottom-10 right-10 " + (isV ? "h-[200px]" : "w-[250px]");
    c.kicker += " z-10 top-4 left-10";
    c.meta1 += " z-10 bottom-4 right-10";
    c.meta2 += " z-10 top-4 right-10";
    c.titleLine += isV ? " text-[48px] text-black" : " text-[48px] text-black";
    c.bodyLine += " text-[#333]";
    c.body2Line += " text-[#666]";
    c.accent1 += " hidden";
    c.accent2 += " hidden";
  }
  else if (pattern === 'split') {
    c.container = "bg-[#111] text-white w-full h-full relative overflow-hidden";
    c.bgWrapper = "absolute z-0 " + (isV ? "w-[1200px] h-[450px] top-0 right-0 border-b-2 border-white" : "w-[600px] h-[900px] right-0 top-0 border-l-2 border-white");
    c.bgWrapper2 = "absolute z-0 " + (isV ? "w-[1200px] h-[450px] bottom-0" : "w-[600px] h-[900px] left-0 top-0");
    c.image += " brightness-110";
    c.image2 += " grayscale blend-multiply";
    c.titleContainer += " z-10 " + (isV ? "left-[880px] top-[500px] h-[340px]" : "top-[160px] left-[80px]");
    c.titleLine += isV ? " text-[64px]" : " text-[72px]";
    c.bodyContainer += " z-10 " + (isV ? "left-[160px] bottom-[60px] h-[340px]" : "bottom-[160px] left-[80px] w-[400px]");
    c.body2Container += " z-10 " + (isV ? "left-[160px] top-[60px] h-[340px]" : "top-[160px] right-[80px] w-[400px]");
    c.bodyLine += " text-white/70";
    c.body2Line += " text-white/70";
    c.kicker += " text-white tracking-[0.3em] font-mono border border-white/20 px-3 py-1 " + (isV ? "top-[500px] left-[60px]" : "top-[80px] left-[80px]");
    c.meta1 += " text-white/50 " + (isV ? "bottom-[420px] right-[80px]" : "bottom-[80px] right-[660px]");
    c.meta2 += " text-white/50 " + (isV ? "top-[40px] left-[60px]" : "bottom-[80px] left-[80px]");
    c.accent1 += " bg-white " + (isV ? "w-[800px] h-[2px] top-[450px] left-1/2 -translate-x-1/2" : "h-[400px] w-[2px] left-[600px] top-1/2 -translate-y-1/2");
    c.accent2 += " border border-white/10 z-10 " + (isV ? "w-[1100px] h-[800px] top-[50px] left-[50px]" : "w-[1100px] h-[800px] top-[50px] left-[50px]");
  }

  return { base, c };
}

interface PreviewCanvasProps {
  imageUrl: string;
  image2Url: string;
  kicker: string;
  heading: string;
  body: string;
  body2: string;
  meta1: string;
  meta2: string;
  orientation: Orientation;
  stylePattern: LayoutStyle;
  gridMode: 'none' | 'cyan' | 'dark' | 'light';
  isEditMode: boolean;
  offsets: Record<string, {x: number, y: number}>;
  onDragEnd: (id: string, dx: number, dy: number) => void;
  showGrid?: boolean;
  blockStyles: Record<string, { [key: string]: any }>;
  selectedBlockId: string | null;
  onSelectBlock: (id: string) => void;
  isMonotone: boolean;
  themeMode: 'dark'|'mono'|'red';
  canvasBgColor: string;
}

const PreviewCanvas = ({ 
  imageUrl, image2Url, kicker, heading, body, body2, meta1, meta2, orientation, stylePattern, gridMode, isEditMode, offsets, onDragEnd, blockStyles, selectedBlockId, onSelectBlock, isMonotone, themeMode, canvasBgColor
}: PreviewCanvasProps) => {
  const { base, c } = getLayoutConfig(stylePattern, orientation);
  
  const preserveSpaces = (text: string) => text.replace(/^[ \t]+/gm, m => '\u00A0'.repeat(m.length));

  const titleLines = (heading || '').split('\n');
  const bodyParagraphs = (body || '').split('\n\n');
  const body2Paragraphs = (body2 || '').split('\n\n');

  const spring = { type: "spring", stiffness: 70, damping: 15, mass: 1.1 };

  const getShadow = (blockId: string, defaultStrokeWidth: number) => {
    let shadows = [];
    if (blockStyles[blockId]?.textStroke) {
      const sw = blockStyles[blockId]?.textStrokeWidth !== undefined ? blockStyles[blockId]?.textStrokeWidth : defaultStrokeWidth;
      // when building stroke, we use text-shadow as fallback/enhancement
      shadows.push(`0 0 ${sw * 2}px ${blockStyles[blockId]?.textStroke}`);
    }
    return shadows.length > 0 ? shadows.join(', ') : undefined;
  };

  const getDropShadowFilter = (blockId: string) => {
    if (blockStyles[blockId]?.dropShadow) {
      const blur = blockStyles[blockId]?.dropShadowBlur !== undefined ? blockStyles[blockId]?.dropShadowBlur : 30;
      const ox = blockStyles[blockId]?.dropShadowX || 0;
      const oy = blockStyles[blockId]?.dropShadowY !== undefined ? blockStyles[blockId]?.dropShadowY : 10;
      return `drop-shadow(${ox}px ${oy}px ${blur}px ${blockStyles[blockId]?.dropShadow})`;
    }
    return undefined;
  };

  const dynamicBaseStyle = { ...base, backgroundColor: canvasBgColor };

  return (
      <motion.div className={`${c.container} artboard-protection`} style={dynamicBaseStyle} transition={spring}>
        
        <DraggableBlock 
          id="bgWrapper" 
          centerOrigin={true} 
          className={c.bgWrapper} 
          gridMode={gridMode}
          isEditMode={isEditMode}
          offset={offsets['bgWrapper'] || {x:0, y:0}} 
          onDragEnd={onDragEnd} 
          spring={spring}
          scale={blockStyles['bgWrapper']?.scale ? blockStyles['bgWrapper'].scale / 100 : 1}
            rotate={blockStyles['bgWrapper']?.rotate || 0}
          width={blockStyles['bgWrapper']?.width}
          height={blockStyles['bgWrapper']?.height}
          onClick={isEditMode ? (e: any) => { e.stopPropagation(); onSelectBlock('bgWrapper'); } : undefined}
          isSelected={selectedBlockId === 'bgWrapper'}
          isHidden={blockStyles['bgWrapper']?.isHidden}
          style={{ 
            pointerEvents: isEditMode ? 'auto' : 'none',
            opacity: blockStyles['bgWrapper']?.opacity !== undefined ? blockStyles['bgWrapper'].opacity / 100 : undefined,
            zIndex: blockStyles['bgWrapper']?.zIndex !== undefined ? blockStyles['bgWrapper'].zIndex : undefined,
            borderWidth: blockStyles['bgWrapper']?.borderWidth !== undefined ? `${blockStyles['bgWrapper']?.borderWidth}px` : undefined,
            borderStyle: blockStyles['bgWrapper']?.borderWidth !== undefined ? 'solid' : undefined,
            borderColor: blockStyles['bgWrapper']?.isBorderColorOff ? 'transparent' : (blockStyles['bgWrapper']?.borderColor || 'white'),
            backgroundColor: blockStyles['bgWrapper']?.isBgColorOff ? 'transparent' : (blockStyles['bgWrapper']?.backgroundColor || undefined),
            borderRadius: blockStyles['bgWrapper']?.borderRadius !== undefined ? `${blockStyles['bgWrapper']?.borderRadius}px` : undefined,
            overflow: blockStyles['bgWrapper']?.borderRadius ? 'hidden' : undefined
          }}
        >
          <motion.img 
            src={imageUrl || DEFAULT_IMAGE} 
            className={c.image} 
            transition={spring} 
            draggable={false}
            style={{ 
              filter: isMonotone ? 'grayscale(100%)' : 'none',
            }}
          />
        </DraggableBlock>

        {(gridMode !== 'none' || isEditMode) && (() => {
          const gridColor = gridMode === 'cyan' ? '#00ffff' : (gridMode === 'dark' ? '#333333' : (gridMode === 'light' ? '#e2e8f0' : (themeMode === 'mono' ? '#111111' : '#e2e8f0')));
          const badgeBg = '#f0f0f0';
          const badgeText = '#4e5d74';
          return (
            <div className="absolute inset-0 z-50 pointer-events-none opacity-60">
              {gridMode !== 'none' && (
                <>
                  <div className="w-full h-full" style={{ backgroundImage: `linear-gradient(${gridColor} 1px, transparent 1px), linear-gradient(90deg, ${gridColor} 1px, transparent 1px)`, backgroundSize: '40px 40px', opacity: 0.8 }} />
                  {/* Safe area guides */}
                  <div className="absolute inset-[80px] border opacity-80" style={{ borderColor: gridColor }} />
                  <div className="absolute inset-0 flex justify-center"><div className="w-[1px] h-full opacity-80" style={{ backgroundColor: gridColor }} /></div>
                  <div className="absolute inset-0 flex flex-col justify-center"><div className="w-full h-[1px] opacity-80" style={{ backgroundColor: gridColor }} /></div>
                </>
              )}
            </div>
          );
        })()}

        {(image2Url || blockStyles['bgWrapper2']?.backgroundColor || isEditMode) && (
          <DraggableBlock 
            id="bgWrapper2" 
            centerOrigin={true} 
            className={c.bgWrapper2} 
            gridMode={gridMode}
            isEditMode={isEditMode}
            offset={offsets['bgWrapper2'] || {x:0, y:0}} 
            onDragEnd={onDragEnd} 
            spring={spring}
            scale={blockStyles['bgWrapper2']?.scale ? blockStyles['bgWrapper2'].scale / 100 : 1}
            rotate={blockStyles['bgWrapper2']?.rotate || 0}
            width={blockStyles['bgWrapper2']?.width}
            height={blockStyles['bgWrapper2']?.height}
            onClick={isEditMode ? (e: any) => { e.stopPropagation(); onSelectBlock('bgWrapper2'); } : undefined}
            isSelected={selectedBlockId === 'bgWrapper2'}
            isHidden={blockStyles['bgWrapper2']?.isHidden}
            style={{ 
              pointerEvents: isEditMode ? 'auto' : 'none',
            opacity: blockStyles['bgWrapper2']?.opacity !== undefined ? blockStyles['bgWrapper2'].opacity / 100 : undefined,
              zIndex: blockStyles['bgWrapper2']?.zIndex !== undefined ? blockStyles['bgWrapper2'].zIndex : undefined,
              borderWidth: blockStyles['bgWrapper2']?.borderWidth !== undefined ? `${blockStyles['bgWrapper2']?.borderWidth}px` : undefined,
              borderStyle: blockStyles['bgWrapper2']?.borderWidth !== undefined ? 'solid' : undefined,
              borderColor: blockStyles['bgWrapper2']?.isBorderColorOff ? 'transparent' : (blockStyles['bgWrapper2']?.borderColor || 'white'),
            backgroundColor: blockStyles['bgWrapper2']?.isBgColorOff ? 'transparent' : (blockStyles['bgWrapper2']?.backgroundColor || undefined),
            borderRadius: blockStyles['bgWrapper2']?.borderRadius !== undefined ? `${blockStyles['bgWrapper2']?.borderRadius}px` : undefined,
            overflow: blockStyles['bgWrapper2']?.borderRadius ? 'hidden' : undefined
            }}
          >
            {image2Url ? (
              <motion.img 
                src={image2Url} 
                className={c.image2} 
                transition={spring} 
                draggable={false}
                style={{ 
                  filter: isMonotone ? 'grayscale(100%)' : 'none',
                }}
              />
            ) : (
              isEditMode ? (
                <div className="w-full h-full border border-dashed border-gray-500/50 flex items-center justify-center bg-gray-500/10 min-w-[100px] min-h-[100px]">
                  <span className="text-gray-500 text-[10px] font-bold font-mono">IMAGE 2 AREA</span>
                </div>
              ) : (
                <div className="w-full h-full min-w-[10px] min-h-[10px]" />
              )
            )}
          </DraggableBlock>
        )}

        <motion.div className={c.contentWrapper} transition={spring}>
          
          <DraggableBlock 
            id="accent1" 
            className={c.accent1} 
            gridMode={gridMode}
            isEditMode={isEditMode}
            offset={offsets['accent1'] || {x:0, y:0}} 
            onDragEnd={onDragEnd} 
            spring={spring} 
            scale={blockStyles['accent1']?.scale ? blockStyles['accent1'].scale / 100 : 1}
            rotate={blockStyles['accent1']?.rotate || 0}
            width={blockStyles['accent1']?.width}
            height={blockStyles['accent1']?.height}
            centerOrigin={true}
            style={{ 
              pointerEvents: isEditMode ? 'auto' : 'none', 
              backgroundColor: blockStyles['accent1']?.isBgColorOff ? 'transparent' : (blockStyles['accent1']?.backgroundColor || blockStyles['accent1']?.color || undefined), 
              borderColor: blockStyles['accent1']?.isBorderColorOff ? 'transparent' : (blockStyles['accent1']?.borderColor || blockStyles['accent1']?.color || undefined), 
              color: blockStyles['accent1']?.color || undefined, 
              borderWidth: blockStyles['accent1']?.borderWidth !== undefined ? `${blockStyles['accent1'].borderWidth}px` : undefined, borderStyle: blockStyles['accent1']?.borderWidth ? 'solid' : undefined,
              opacity: blockStyles['accent1']?.opacity !== undefined ? blockStyles['accent1'].opacity / 100 : undefined,
              zIndex: blockStyles['accent1']?.zIndex !== undefined ? blockStyles['accent1'].zIndex : undefined,
              borderRadius: blockStyles['accent1']?.borderRadius !== undefined ? `${blockStyles['accent1']?.borderRadius}px` : undefined,
              overflow: blockStyles['accent1']?.borderRadius ? 'hidden' : undefined,
              display: (blockStyles['accent1']?.backgroundColor || blockStyles['accent1']?.borderColor || blockStyles['accent1']?.color || isEditMode) ? 'block' : undefined
            }}
            isSelected={selectedBlockId === 'accent1'}
            isHidden={blockStyles['accent1']?.isHidden}
            onClick={isEditMode ? (e: any) => { e.stopPropagation(); onSelectBlock('accent1'); } : undefined}
          />
          <DraggableBlock 
            id="accent2" 
            className={c.accent2} 
            gridMode={gridMode}
            isEditMode={isEditMode}
            offset={offsets['accent2'] || {x:0, y:0}} 
            onDragEnd={onDragEnd} 
            spring={spring} 
            scale={blockStyles['accent2']?.scale ? blockStyles['accent2'].scale / 100 : 1}
            rotate={blockStyles['accent2']?.rotate || 0}
            width={blockStyles['accent2']?.width}
            height={blockStyles['accent2']?.height}
            centerOrigin={true}
            style={{ 
              pointerEvents: isEditMode ? 'auto' : 'none', 
              backgroundColor: blockStyles['accent2']?.isBgColorOff ? 'transparent' : (blockStyles['accent2']?.backgroundColor || blockStyles['accent2']?.color || undefined), 
              borderColor: blockStyles['accent2']?.isBorderColorOff ? 'transparent' : (blockStyles['accent2']?.borderColor || blockStyles['accent2']?.color || undefined), 
              color: blockStyles['accent2']?.color || undefined, 
              borderWidth: blockStyles['accent2']?.borderWidth !== undefined ? `${blockStyles['accent2'].borderWidth}px` : undefined, borderStyle: blockStyles['accent2']?.borderWidth ? 'solid' : undefined,
              opacity: blockStyles['accent2']?.opacity !== undefined ? blockStyles['accent2'].opacity / 100 : undefined,
              zIndex: blockStyles['accent2']?.zIndex !== undefined ? blockStyles['accent2'].zIndex : undefined,
              borderRadius: blockStyles['accent2']?.borderRadius !== undefined ? `${blockStyles['accent2']?.borderRadius}px` : undefined,
              overflow: blockStyles['accent2']?.borderRadius ? 'hidden' : undefined,
              display: (blockStyles['accent2']?.backgroundColor || blockStyles['accent2']?.borderColor || blockStyles['accent2']?.color || isEditMode) ? 'block' : undefined
            }}
            isSelected={selectedBlockId === 'accent2'}
            isHidden={blockStyles['accent2']?.isHidden}
            onClick={isEditMode ? (e: any) => { e.stopPropagation(); onSelectBlock('accent2'); } : undefined}
          />
          
          <DraggableBlock 
            id="kicker" 
            centerOrigin={true}
            className={c.kicker} 
            gridMode={gridMode}
            isEditMode={isEditMode}
            offset={offsets['kicker'] || {x:0, y:0}} 
            onDragEnd={onDragEnd} 
            spring={spring} 
            scale={blockStyles['kicker']?.scale ? blockStyles['kicker'].scale / 100 : 1}
            rotate={blockStyles['kicker']?.rotate || 0}
            width={blockStyles['kicker']?.width}
            height={blockStyles['kicker']?.height}
            style={{ 
              pointerEvents: isEditMode ? 'auto' : 'none', opacity: blockStyles['kicker']?.opacity !== undefined ? blockStyles['kicker'].opacity / 100 : undefined, backgroundColor: blockStyles['kicker']?.isBgColorOff ? 'transparent' : (blockStyles['kicker']?.backgroundColor || undefined), borderColor: blockStyles['kicker']?.isBorderColorOff ? 'transparent' : (blockStyles['kicker']?.borderColor || undefined), borderWidth: blockStyles['kicker']?.borderWidth !== undefined ? `${blockStyles['kicker'].borderWidth}px` : undefined, borderStyle: blockStyles['kicker']?.borderWidth ? 'solid' : undefined, borderRadius: blockStyles['kicker']?.borderRadius !== undefined ? `${blockStyles['kicker'].borderRadius}px` : undefined, overflow: blockStyles['kicker']?.borderRadius ? 'hidden' : undefined, color: blockStyles['kicker']?.color || undefined, fontFamily: blockStyles['kicker']?.fontFamily || undefined, letterSpacing: blockStyles['kicker']?.letterSpacing !== undefined ? `${blockStyles['kicker']?.letterSpacing}em` : undefined, lineHeight: blockStyles['kicker']?.lineHeight !== undefined ? blockStyles['kicker']?.lineHeight : undefined, zIndex: blockStyles['kicker']?.zIndex !== undefined ? blockStyles['kicker'].zIndex : undefined,
              writingMode: (blockStyles['kicker']?.writingMode || undefined) as any,
              textAlign: (blockStyles['kicker']?.textAlign || undefined) as any,
              WebkitTextStroke: blockStyles['kicker']?.textStroke ? `${blockStyles['kicker']?.textStrokeWidth !== undefined ? blockStyles['kicker'].textStrokeWidth : 1}px ${blockStyles['kicker'].textStroke}` : undefined,
              textShadow: getShadow('kicker', 1),
              filter: getDropShadowFilter('kicker'),
              whiteSpace: 'pre-wrap',
              ...(blockStyles['kicker']?.bgBlur === 'dark' ? { backgroundColor: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(8px)', padding: '24px', borderRadius: '8px' } : {}),
              ...(blockStyles['kicker']?.bgBlur === 'light' ? { backgroundColor: 'rgba(255,255,255,0.5)', backdropFilter: 'blur(8px)', padding: '24px', borderRadius: '8px' } : {})
            }}
            isSelected={selectedBlockId === 'kicker'}
            isHidden={blockStyles['kicker']?.isHidden}
            onClick={isEditMode ? (e: any) => { e.stopPropagation(); onSelectBlock('kicker'); } : undefined}
          >
            {preserveSpaces(kicker)}
          </DraggableBlock>
          
          <DraggableBlock 
            id="titleContainer" 
            centerOrigin={true}
            className={c.titleContainer} 
            gridMode={gridMode}
            isEditMode={isEditMode}
            offset={offsets['titleContainer'] || {x:0, y:0}} 
            onDragEnd={onDragEnd} 
            spring={spring} 
            scale={blockStyles['titleContainer']?.scale ? blockStyles['titleContainer'].scale / 100 : 1}
            rotate={blockStyles['titleContainer']?.rotate || 0}
            width={blockStyles['titleContainer']?.width}
            height={blockStyles['titleContainer']?.height}
            style={{ 
              pointerEvents: isEditMode ? 'auto' : 'none', opacity: blockStyles['titleContainer']?.opacity !== undefined ? blockStyles['titleContainer'].opacity / 100 : undefined, backgroundColor: blockStyles['titleContainer']?.isBgColorOff ? 'transparent' : (blockStyles['titleContainer']?.backgroundColor || undefined), borderColor: blockStyles['titleContainer']?.isBorderColorOff ? 'transparent' : (blockStyles['titleContainer']?.borderColor || undefined), borderWidth: blockStyles['titleContainer']?.borderWidth !== undefined ? `${blockStyles['titleContainer'].borderWidth}px` : undefined, borderStyle: blockStyles['titleContainer']?.borderWidth ? 'solid' : undefined, borderRadius: blockStyles['titleContainer']?.borderRadius !== undefined ? `${blockStyles['titleContainer'].borderRadius}px` : undefined, overflow: blockStyles['titleContainer']?.borderRadius ? 'hidden' : undefined, color: blockStyles['titleContainer']?.color || undefined, fontFamily: blockStyles['titleContainer']?.fontFamily || undefined, letterSpacing: blockStyles['titleContainer']?.letterSpacing !== undefined ? `${blockStyles['titleContainer']?.letterSpacing}em` : undefined, lineHeight: blockStyles['titleContainer']?.lineHeight !== undefined ? blockStyles['titleContainer']?.lineHeight : undefined, zIndex: blockStyles['titleContainer']?.zIndex !== undefined ? blockStyles['titleContainer'].zIndex : undefined,
              writingMode: (blockStyles['titleContainer']?.writingMode || undefined) as any,
              textAlign: (blockStyles['titleContainer']?.textAlign || undefined) as any,
              alignItems: blockStyles['titleContainer']?.textAlign === 'center' ? 'center' : blockStyles['titleContainer']?.textAlign === 'right' ? 'flex-end' : blockStyles['titleContainer']?.textAlign === 'left' ? 'flex-start' : undefined,
              WebkitTextStroke: blockStyles['titleContainer']?.textStroke ? `${blockStyles['titleContainer']?.textStrokeWidth !== undefined ? blockStyles['titleContainer'].textStrokeWidth : 2}px ${blockStyles['titleContainer'].textStroke}` : undefined,
              textShadow: getShadow('titleContainer', 2),
              filter: getDropShadowFilter('titleContainer'),
              whiteSpace: 'pre-wrap',
              ...(blockStyles['titleContainer']?.bgBlur === 'dark' ? { backgroundColor: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(8px)', padding: '24px', borderRadius: '8px' } : {}),
              ...(blockStyles['titleContainer']?.bgBlur === 'light' ? { backgroundColor: 'rgba(255,255,255,0.5)', backdropFilter: 'blur(8px)', padding: '24px', borderRadius: '8px' } : {})
            }}
            isSelected={selectedBlockId === 'titleContainer'}
            isHidden={blockStyles['titleContainer']?.isHidden}
            onClick={isEditMode ? (e: any) => { e.stopPropagation(); onSelectBlock('titleContainer'); } : undefined}
          >
            {titleLines.map((line, i) => (
              <motion.div key={i} className={c.titleLine} transition={spring} style={{ color: blockStyles['titleContainer']?.color || undefined, whiteSpace: 'pre-wrap', letterSpacing: blockStyles['titleContainer']?.letterSpacing !== undefined ? `${blockStyles['titleContainer']?.letterSpacing}em` : undefined, lineHeight: blockStyles['titleContainer']?.lineHeight !== undefined ? blockStyles['titleContainer']?.lineHeight : undefined }}>
                {line === '' ? '\u00A0' : line}
              </motion.div>
            ))}
          </DraggableBlock>
          
          <DraggableBlock 
            id="bodyContainer" 
            centerOrigin={true}
            className={c.bodyContainer} 
            gridMode={gridMode}
            isEditMode={isEditMode}
            offset={offsets['bodyContainer'] || {x:0, y:0}} 
            onDragEnd={onDragEnd} 
            spring={spring} 
            scale={blockStyles['bodyContainer']?.scale ? blockStyles['bodyContainer'].scale / 100 : 1}
            rotate={blockStyles['bodyContainer']?.rotate || 0}
            width={blockStyles['bodyContainer']?.width}
            height={blockStyles['bodyContainer']?.height}
            style={{ 
              pointerEvents: isEditMode ? 'auto' : 'none', opacity: blockStyles['bodyContainer']?.opacity !== undefined ? blockStyles['bodyContainer'].opacity / 100 : undefined, backgroundColor: blockStyles['bodyContainer']?.isBgColorOff ? 'transparent' : (blockStyles['bodyContainer']?.backgroundColor || undefined), borderColor: blockStyles['bodyContainer']?.isBorderColorOff ? 'transparent' : (blockStyles['bodyContainer']?.borderColor || undefined), borderWidth: blockStyles['bodyContainer']?.borderWidth !== undefined ? `${blockStyles['bodyContainer'].borderWidth}px` : undefined, borderStyle: blockStyles['bodyContainer']?.borderWidth ? 'solid' : undefined, borderRadius: blockStyles['bodyContainer']?.borderRadius !== undefined ? `${blockStyles['bodyContainer'].borderRadius}px` : undefined, overflow: blockStyles['bodyContainer']?.borderRadius ? 'hidden' : undefined, color: blockStyles['bodyContainer']?.color || undefined, fontFamily: blockStyles['bodyContainer']?.fontFamily || undefined, letterSpacing: blockStyles['bodyContainer']?.letterSpacing !== undefined ? `${blockStyles['bodyContainer']?.letterSpacing}em` : undefined, lineHeight: blockStyles['bodyContainer']?.lineHeight !== undefined ? blockStyles['bodyContainer']?.lineHeight : undefined, zIndex: blockStyles['bodyContainer']?.zIndex !== undefined ? blockStyles['bodyContainer'].zIndex : undefined,
              writingMode: (blockStyles['bodyContainer']?.writingMode || undefined) as any,
              textAlign: (blockStyles['bodyContainer']?.textAlign || undefined) as any,
              alignItems: blockStyles['bodyContainer']?.textAlign === 'center' ? 'center' : blockStyles['bodyContainer']?.textAlign === 'right' ? 'flex-end' : blockStyles['bodyContainer']?.textAlign === 'left' ? 'flex-start' : undefined,
              WebkitTextStroke: blockStyles['bodyContainer']?.textStroke ? `${blockStyles['bodyContainer']?.textStrokeWidth !== undefined ? blockStyles['bodyContainer'].textStrokeWidth : 0.5}px ${blockStyles['bodyContainer'].textStroke}` : undefined,
              textShadow: getShadow('bodyContainer', 0.5),
              filter: getDropShadowFilter('bodyContainer'),
              whiteSpace: 'pre-wrap',
              ...(blockStyles['bodyContainer']?.bgBlur === 'dark' ? { backgroundColor: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(8px)', padding: '24px', borderRadius: '8px' } : {}),
              ...(blockStyles['bodyContainer']?.bgBlur === 'light' ? { backgroundColor: 'rgba(255,255,255,0.5)', backdropFilter: 'blur(8px)', padding: '24px', borderRadius: '8px' } : {})
            }}
            isSelected={selectedBlockId === 'bodyContainer'}
            isHidden={blockStyles['bodyContainer']?.isHidden}
            onClick={isEditMode ? (e: any) => { e.stopPropagation(); onSelectBlock('bodyContainer'); } : undefined}
          >
            {bodyParagraphs.map((p, i) => (
              <motion.p key={i} className={c.bodyLine} transition={spring} style={{ color: blockStyles['bodyContainer']?.color || undefined, whiteSpace: 'pre-wrap', letterSpacing: blockStyles['bodyContainer']?.letterSpacing !== undefined ? `${blockStyles['bodyContainer']?.letterSpacing}em` : undefined, lineHeight: blockStyles['bodyContainer']?.lineHeight !== undefined ? blockStyles['bodyContainer']?.lineHeight : undefined }}>
                {p === '' ? '\u00A0' : preserveSpaces(p)}
              </motion.p>
            ))}
          </DraggableBlock>
          
          {(body2Paragraphs.length > 0 || isEditMode) && (
            <DraggableBlock 
              id="body2Container" 
              centerOrigin={true}
            className={c.body2Container} 
              gridMode={gridMode} 
              isEditMode={isEditMode}
              offset={offsets['body2Container'] || {x:0, y:0}} 
              onDragEnd={onDragEnd} 
              spring={spring} 
              scale={blockStyles['body2Container']?.scale ? blockStyles['body2Container'].scale / 100 : 1}
            rotate={blockStyles['body2Container']?.rotate || 0}
              width={blockStyles['body2Container']?.width}
              height={blockStyles['body2Container']?.height}
              style={{ 
                pointerEvents: isEditMode ? 'auto' : 'none', opacity: blockStyles['body2Container']?.opacity !== undefined ? blockStyles['body2Container'].opacity / 100 : undefined, backgroundColor: blockStyles['body2Container']?.isBgColorOff ? 'transparent' : (blockStyles['body2Container']?.backgroundColor || undefined), borderColor: blockStyles['body2Container']?.isBorderColorOff ? 'transparent' : (blockStyles['body2Container']?.borderColor || undefined), borderWidth: blockStyles['body2Container']?.borderWidth !== undefined ? `${blockStyles['body2Container'].borderWidth}px` : undefined, borderStyle: blockStyles['body2Container']?.borderWidth ? 'solid' : undefined, borderRadius: blockStyles['body2Container']?.borderRadius !== undefined ? `${blockStyles['body2Container'].borderRadius}px` : undefined, overflow: blockStyles['body2Container']?.borderRadius ? 'hidden' : undefined, color: blockStyles['body2Container']?.color || undefined, fontFamily: blockStyles['body2Container']?.fontFamily || undefined, letterSpacing: blockStyles['body2Container']?.letterSpacing !== undefined ? `${blockStyles['body2Container']?.letterSpacing}em` : undefined, lineHeight: blockStyles['body2Container']?.lineHeight !== undefined ? blockStyles['body2Container']?.lineHeight : undefined, zIndex: blockStyles['body2Container']?.zIndex !== undefined ? blockStyles['body2Container'].zIndex : undefined,
                writingMode: (blockStyles['body2Container']?.writingMode || undefined) as any,
                textAlign: (blockStyles['body2Container']?.textAlign || undefined) as any,
                alignItems: blockStyles['body2Container']?.textAlign === 'center' ? 'center' : blockStyles['body2Container']?.textAlign === 'right' ? 'flex-end' : blockStyles['body2Container']?.textAlign === 'left' ? 'flex-start' : undefined,
                WebkitTextStroke: blockStyles['body2Container']?.textStroke ? `${blockStyles['body2Container']?.textStrokeWidth !== undefined ? blockStyles['body2Container'].textStrokeWidth : 0.5}px ${blockStyles['body2Container'].textStroke}` : undefined,
                textShadow: getShadow('body2Container', 0.5),
                filter: getDropShadowFilter('body2Container'),
                whiteSpace: 'pre-wrap',
              ...(blockStyles['body2Container']?.bgBlur === 'dark' ? { backgroundColor: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(8px)', padding: '24px', borderRadius: '8px' } : {}),
              ...(blockStyles['body2Container']?.bgBlur === 'light' ? { backgroundColor: 'rgba(255,255,255,0.5)', backdropFilter: 'blur(8px)', padding: '24px', borderRadius: '8px' } : {})
              }}
              isSelected={selectedBlockId === 'body2Container'}
              isHidden={blockStyles['body2Container']?.isHidden}
              onClick={isEditMode ? (e: any) => { e.stopPropagation(); onSelectBlock('body2Container'); } : undefined}
            >
              {body2Paragraphs.length > 0 ? (
                body2Paragraphs.map((p, i) => (
                  <motion.p key={i} className={c.body2Line} transition={spring} style={{ color: blockStyles['body2Container']?.color || undefined, whiteSpace: 'pre-wrap', letterSpacing: blockStyles['body2Container']?.letterSpacing !== undefined ? `${blockStyles['body2Container']?.letterSpacing}em` : undefined, lineHeight: blockStyles['body2Container']?.lineHeight !== undefined ? blockStyles['body2Container']?.lineHeight : undefined }}>
                    {p === '' ? '\u00A0' : preserveSpaces(p)}
                  </motion.p>
                ))
              ) : (
                <div className="w-full h-full border border-dashed border-gray-500/50 flex items-center justify-center bg-gray-500/10 min-w-[100px] min-h-[50px]">
                  <span className="text-[#00ffff] text-[10px] font-bold font-mono">BODY TEXT 2</span>
                </div>
              )}
            </DraggableBlock>
        )}

          <DraggableBlock 
            id="meta1" 
            centerOrigin={true}
            className={c.meta1} 
            gridMode={gridMode}
            isEditMode={isEditMode}
            offset={offsets['meta1'] || {x:0, y:0}} 
            onDragEnd={onDragEnd} 
            spring={spring} 
            scale={blockStyles['meta1']?.scale ? blockStyles['meta1'].scale / 100 : 1}
            rotate={blockStyles['meta1']?.rotate || 0}
            width={blockStyles['meta1']?.width}
            height={blockStyles['meta1']?.height}
            style={{ 
              pointerEvents: isEditMode ? 'auto' : 'none', opacity: blockStyles['meta1']?.opacity !== undefined ? blockStyles['meta1'].opacity / 100 : undefined, backgroundColor: blockStyles['meta1']?.isBgColorOff ? 'transparent' : (blockStyles['meta1']?.backgroundColor || undefined), borderColor: blockStyles['meta1']?.isBorderColorOff ? 'transparent' : (blockStyles['meta1']?.borderColor || undefined), borderWidth: blockStyles['meta1']?.borderWidth !== undefined ? `${blockStyles['meta1'].borderWidth}px` : undefined, borderStyle: blockStyles['meta1']?.borderWidth ? 'solid' : undefined, borderRadius: blockStyles['meta1']?.borderRadius !== undefined ? `${blockStyles['meta1'].borderRadius}px` : undefined, overflow: blockStyles['meta1']?.borderRadius ? 'hidden' : undefined, color: blockStyles['meta1']?.color || undefined, fontFamily: blockStyles['meta1']?.fontFamily || undefined, letterSpacing: blockStyles['meta1']?.letterSpacing !== undefined ? `${blockStyles['meta1']?.letterSpacing}em` : undefined, lineHeight: blockStyles['meta1']?.lineHeight !== undefined ? blockStyles['meta1']?.lineHeight : undefined, zIndex: blockStyles['meta1']?.zIndex !== undefined ? blockStyles['meta1'].zIndex : undefined,
              writingMode: (blockStyles['meta1']?.writingMode || undefined) as any,
              textAlign: (blockStyles['meta1']?.textAlign || undefined) as any,
              WebkitTextStroke: blockStyles['meta1']?.textStroke ? `${blockStyles['meta1']?.textStrokeWidth !== undefined ? blockStyles['meta1'].textStrokeWidth : 0.5}px ${blockStyles['meta1'].textStroke}` : undefined,
              textShadow: getShadow('meta1', 0.5),
              filter: getDropShadowFilter('meta1'),
              whiteSpace: 'pre-wrap',
              ...(blockStyles['meta1']?.bgBlur === 'dark' ? { backgroundColor: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(8px)', padding: '24px', borderRadius: '8px' } : {}),
              ...(blockStyles['meta1']?.bgBlur === 'light' ? { backgroundColor: 'rgba(255,255,255,0.5)', backdropFilter: 'blur(8px)', padding: '24px', borderRadius: '8px' } : {})
            }}
            isSelected={selectedBlockId === 'meta1'}
            isHidden={blockStyles['meta1']?.isHidden}
            onClick={isEditMode ? (e: any) => { e.stopPropagation(); onSelectBlock('meta1'); } : undefined}
          >
            {preserveSpaces(meta1)}
          </DraggableBlock>
          
          <DraggableBlock 
            id="meta2" 
            centerOrigin={true}
            className={c.meta2} 
            gridMode={gridMode}
            isEditMode={isEditMode}
            offset={offsets['meta2'] || {x:0, y:0}} 
            onDragEnd={onDragEnd} 
            spring={spring} 
            scale={blockStyles['meta2']?.scale ? blockStyles['meta2'].scale / 100 : 1}
            rotate={blockStyles['meta2']?.rotate || 0}
            width={blockStyles['meta2']?.width}
            height={blockStyles['meta2']?.height}
            style={{ 
              pointerEvents: isEditMode ? 'auto' : 'none', opacity: blockStyles['meta2']?.opacity !== undefined ? blockStyles['meta2'].opacity / 100 : undefined, backgroundColor: blockStyles['meta2']?.isBgColorOff ? 'transparent' : (blockStyles['meta2']?.backgroundColor || undefined), borderColor: blockStyles['meta2']?.isBorderColorOff ? 'transparent' : (blockStyles['meta2']?.borderColor || undefined), borderWidth: blockStyles['meta2']?.borderWidth !== undefined ? `${blockStyles['meta2'].borderWidth}px` : undefined, borderStyle: blockStyles['meta2']?.borderWidth ? 'solid' : undefined, borderRadius: blockStyles['meta2']?.borderRadius !== undefined ? `${blockStyles['meta2'].borderRadius}px` : undefined, overflow: blockStyles['meta2']?.borderRadius ? 'hidden' : undefined, color: blockStyles['meta2']?.color || undefined, fontFamily: blockStyles['meta2']?.fontFamily || undefined, letterSpacing: blockStyles['meta2']?.letterSpacing !== undefined ? `${blockStyles['meta2']?.letterSpacing}em` : undefined, lineHeight: blockStyles['meta2']?.lineHeight !== undefined ? blockStyles['meta2']?.lineHeight : undefined, zIndex: blockStyles['meta2']?.zIndex !== undefined ? blockStyles['meta2'].zIndex : undefined,
              writingMode: (blockStyles['meta2']?.writingMode || undefined) as any,
              textAlign: (blockStyles['meta2']?.textAlign || undefined) as any,
              WebkitTextStroke: blockStyles['meta2']?.textStroke ? `${blockStyles['meta2']?.textStrokeWidth !== undefined ? blockStyles['meta2'].textStrokeWidth : 0.5}px ${blockStyles['meta2'].textStroke}` : undefined,
              textShadow: getShadow('meta2', 0.5),
              filter: getDropShadowFilter('meta2'),
              whiteSpace: 'pre-wrap',
              ...(blockStyles['meta2']?.bgBlur === 'dark' ? { backgroundColor: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(8px)', padding: '24px', borderRadius: '8px' } : {}),
              ...(blockStyles['meta2']?.bgBlur === 'light' ? { backgroundColor: 'rgba(255,255,255,0.5)', backdropFilter: 'blur(8px)', padding: '24px', borderRadius: '8px' } : {})
            }}
            isSelected={selectedBlockId === 'meta2'}
            isHidden={blockStyles['meta2']?.isHidden}
            onClick={isEditMode ? (e: any) => { e.stopPropagation(); onSelectBlock('meta2'); } : undefined}
          >
            {preserveSpaces(meta2)}
          </DraggableBlock>

        </motion.div>

      </motion.div>
  );
};

export default function App() {
  const initialState = (() => {
    try {
      const saved = localStorage.getItem('solid-design-state');
      return saved ? JSON.parse(saved) : {};
    } catch (e) {
      return {};
    }
  })();

  const [imageUrl, setImageUrl] = useState<string>(initialState.imageUrl ?? '');
  const [image2Url, setImage2Url] = useState<string>(initialState.image2Url ?? '');
  const [kicker, setKicker] = useState(initialState.kicker ?? DEFAULT_KICKER);
  const [heading, setHeading] = useState(initialState.heading ?? DEFAULT_HEADING);
  const [body, setBody] = useState(initialState.body ?? DEFAULT_BODY);
  const [body2, setBody2] = useState(initialState.body2 ?? '');
  const [meta1, setMeta1] = useState(initialState.meta1 ?? DEFAULT_META1);
  const [meta2, setMeta2] = useState(initialState.meta2 ?? DEFAULT_META2);
  
  const [orientation, setOrientation] = useState<Orientation>(initialState.orientation ?? 'vertical');
  const [stylePattern, setStylePattern] = useState<LayoutStyle>(initialState.stylePattern ?? 'story');
  const [gridMode, setGridMode] = useState<'none'|'cyan'|'dark'|'light'>('none');
  const [gridColor, setGridColor] = useState<'cyan'|'dark'|'light'>('light');
  const [isEditMode, setIsEditMode] = useState<boolean>(true);
  const [activeTab, setActiveTab] = useState<'design'|'image'|'text'>('design');
  const [isMonotone, setIsMonotone] = useState<boolean>(initialState.isMonotone ?? false);
  const [filledSlots, setFilledSlots] = useState<number[]>([]);
  const [sidebarPosition, setSidebarPosition] = useState<'left'|'right'>('left');
  const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(true);
  const [canvasBgColor, setCanvasBgColor] = useState<string>('#ffffff');
  const [themeMode, setThemeMode] = useState<'dark'|'mono'|'red'>('dark');
  const [isGlobalSettingsOpen, setIsGlobalSettingsOpen] = useState<boolean>(false);
  const [artboardShadow, setArtboardShadow] = useState<boolean>(true);
  const [artboardScaleParam, setArtboardScaleParam] = useState<number>(initialState.artboardScaleParam ?? 92);
  const [artboardOffset, setArtboardOffset] = useState(initialState.artboardOffset ?? { x: 0, y: 0 });
  const [isPanning, setIsPanning] = useState<boolean>(false);
  const [showStatusText, setShowStatusText] = useState<boolean>(true);
  const [statusOpacity, setStatusOpacity] = useState<number>(80);
  const [statusTheme, setStatusTheme] = useState<'dark'|'light'>('dark');
  const [isPanelCollapsed, setIsPanelCollapsed] = useState<boolean>(true);
  const [lang, setLang] = useState<'en'|'jp'>('en');
  const [isHeaderOpen, setIsHeaderOpen] = useState<boolean>(true);
  const [resetConfirmTarget, setResetConfirmTarget] = useState<'all' | 'un-offset' | string | null>(null);

  useEffect(() => {
    const filled: number[] = [];
    [1, 2, 3, 4].forEach(slot => {
      if (localStorage.getItem(`solid-design-slot-${slot}`)) filled.push(slot);
    });
    setFilledSlots(filled);
  }, []);
  
  const [isFontDropdownOpen, setIsFontDropdownOpen] = useState(false);
  const [selectedBlockId, setSelectedBlockId] = useState<string | null>(null);
  const [blockStyles, setBlockStyles] = useState<Record<string, Record<string, { [key: string]: any }>>>(initialState.blockStyles ?? {});
  
  const [presets, setPresets] = useState<any[]>(() => {
    try {
      const saved = localStorage.getItem('solid-design-presets');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });
  const [offsets, setOffsets] = useState<Record<string, Record<string, {x:number,y:number}>>>(initialState.offsets ?? {});
  
  const canvasRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const panelConstraintsRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(1);

  // Auto-save presets
  useEffect(() => {
    localStorage.setItem('solid-design-presets', JSON.stringify(presets));
  }, [presets]);

  const [isSaving, setIsSaving] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
  }, []);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isEditMode || !selectedBlockId) return;

      if (
        document.activeElement?.tagName === 'INPUT' ||
        document.activeElement?.tagName === 'TEXTAREA' ||
        document.activeElement?.tagName === 'SELECT'
      ) {
        return;
      }

      const step = e.shiftKey ? 10 : 1;
      let dx = 0;
      let dy = 0;

      switch (e.key) {
        case 'ArrowUp':
          dy = -step;
          break;
        case 'ArrowDown':
          dy = step;
          break;
        case 'ArrowLeft':
          dx = -step;
          break;
        case 'ArrowRight':
          dx = step;
          break;
        default:
          return;
      }

      e.preventDefault();

      setOffsets(prev => {
        const activeKey = `${stylePattern}-${orientation}`;
        const activeOffsets = prev[activeKey] || {};
        const current = activeOffsets[selectedBlockId] || {x: 0, y: 0};
        return {
          ...prev,
          [activeKey]: {
            ...activeOffsets,
            [selectedBlockId]: {
              x: current.x + dx,
              y: current.y + dy
            }
          }
        };
      });
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isEditMode, selectedBlockId, stylePattern, orientation]);

  const getFriendlyName = (id: string) => {
    const map: Record<string, string> = {
      kicker: 'KICKER TAG',
      titleContainer: 'HEADING TEXT',
      bodyContainer: 'BODY TEXT 1',
      body2Container: 'BODY TEXT 2',
      meta1: 'META 1',
      meta2: 'META 2',
      bgWrapper: 'IMAGE 1',
      bgWrapper2: 'IMAGE 2',
      accent1: 'ACCENT 1',
      accent2: 'ACCENT 2'
    };
    return map[id] || id.toUpperCase();
  };

  const handleSelectBlock = (blockId: string) => {
    setSelectedBlockId(blockId);
    if (!isEditMode) setIsEditMode(true);
    if (['bgWrapper', 'bgWrapper2', 'accent1', 'accent2'].includes(blockId)) {
      setActiveTab('image');
    } else {
      setActiveTab('text');
    }
  };

  const TargetButton = ({ blockId, label }: { blockId: string, label?: string }) => {
    const isSelected = selectedBlockId === blockId;
    const isHidden = blockStyles[`${stylePattern}-${orientation}`]?.[blockId]?.isHidden;

    return (
      <div className="flex items-center gap-1">
        <button 
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            handleBlockStyleChange('isHidden', !isHidden, blockId);
          }}
          className={`px-1.5 py-0.5 rounded border transition-all flex items-center justify-center shrink-0 ${isHidden ? 'bg-red-500/20 text-red-400 border-red-500/30' : 'bg-[#1e252e] text-[#8a95a3] border-[#1e252e] hover:border-[#4e5d74] hover:text-[#00ffff]'}`}
          title={isHidden ? "Show on Canvas" : "Hide from Canvas"}
        >
          {isHidden ? (
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path><line x1="1" y1="1" x2="23" y2="23"></line></svg>
          ) : (
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle></svg>
          )}
        </button>
        <button 
          onClick={(e) => {
            e.stopPropagation();
            handleSelectBlock(blockId);
          }}
          className={`px-2 py-0.5 text-[9px] font-bold border rounded transition-all flex items-center justify-center shrink-0 gap-1 ${isSelected ? 'bg-[#00ffff] text-black border-[#00ffff] shadow-[0_0_10px_rgba(0,255,255,0.5)]' : 'bg-[#1e252e] text-[#8a95a3] border-[#1e252e] hover:border-[#4e5d74]'}`}
        >
          <span className="text-[10px] leading-none mb-[1px]">⚙️</span> {label || 'STYLES'}
        </button>
      </div>
    );
  };

  // Auto-save working state
  useEffect(() => {
    const state = {
      imageUrl, image2Url, kicker, heading, body, body2, meta1, meta2, 
      orientation, stylePattern, offsets, blockStyles,
      isMonotone, artboardScaleParam, artboardOffset
    };
    localStorage.setItem('solid-design-state', JSON.stringify(state));
  }, [imageUrl, image2Url, kicker, heading, body, body2, meta1, meta2, orientation, stylePattern, offsets, blockStyles, isMonotone, artboardScaleParam, artboardOffset]);

  const handleManualSave = () => {
    setIsSaving(true);
    const data = { imageUrl, image2Url, kicker, heading, body, body2, meta1, meta2, orientation, stylePattern, gridMode, isMonotone, blockStyles, offsets };
    localStorage.setItem(`solid-design-slot-1`, JSON.stringify(data));
    setFilledSlots(prev => prev.includes(1) ? prev : [...prev, 1]);
    setTimeout(() => setIsSaving(false), 300);
  };

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleExportProject = () => {
    const state = {
      imageUrl, image2Url, kicker, heading, body, body2, meta1, meta2, 
      orientation, stylePattern, offsets, blockStyles,
      isMonotone, artboardScaleParam, artboardOffset
    };
    const blob = new Blob([JSON.stringify(state, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `solid-design-project-${new Date().getTime()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleImportProject = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const state = JSON.parse(event.target?.result as string);
        if (state.imageUrl !== undefined) setImageUrl(state.imageUrl);
        if (state.image2Url !== undefined) setImage2Url(state.image2Url);
        if (state.kicker !== undefined) setKicker(state.kicker);
        if (state.heading !== undefined) setHeading(state.heading);
        if (state.body !== undefined) setBody(state.body);
        if (state.body2 !== undefined) setBody2(state.body2);
        if (state.meta1 !== undefined) setMeta1(state.meta1);
        if (state.meta2 !== undefined) setMeta2(state.meta2);
        if (state.orientation !== undefined) setOrientation(state.orientation);
        if (state.stylePattern !== undefined) setStylePattern(state.stylePattern);
        if (state.offsets !== undefined) setOffsets(state.offsets);
        if (state.blockStyles !== undefined) setBlockStyles(state.blockStyles);
        if (state.isMonotone !== undefined) setIsMonotone(state.isMonotone);
        if (state.artboardScaleParam !== undefined) setArtboardScaleParam(state.artboardScaleParam);
        if (state.artboardOffset !== undefined) setArtboardOffset(state.artboardOffset);
      } catch (err) {
        console.error('Failed to parse project file', err);
        alert(lang === 'jp' ? 'ファイルの読み込みに失敗しました。' : 'Failed to load project file.');
      }
    };
    reader.readAsText(file);
    e.target.value = '';
  };

  const loadSlot = (slot: number) => {
    try {
      const dataStr = localStorage.getItem(`solid-design-slot-${slot}`);
      if (!dataStr) return;
      const cs = JSON.parse(dataStr);
      if (cs.imageUrl !== undefined) setImageUrl(cs.imageUrl);
      if (cs.image2Url !== undefined) setImage2Url(cs.image2Url);
      if (cs.kicker !== undefined) setKicker(cs.kicker);
      if (cs.heading !== undefined) setHeading(cs.heading);
      if (cs.body !== undefined) setBody(cs.body);
      if (cs.body2 !== undefined) setBody2(cs.body2);
      if (cs.meta1 !== undefined) setMeta1(cs.meta1);
      if (cs.meta2 !== undefined) setMeta2(cs.meta2);
      if (cs.orientation !== undefined) setOrientation(cs.orientation);
      if (cs.stylePattern !== undefined) setStylePattern(cs.stylePattern);
      if (cs.gridMode !== undefined) setGridMode(cs.gridMode);
      if (cs.isMonotone !== undefined) setIsMonotone(cs.isMonotone);
      if (cs.blockStyles !== undefined) setBlockStyles(cs.blockStyles);
      if (cs.offsets !== undefined) setOffsets(cs.offsets);
    } catch (e) {
      console.error('Failed to load slot', e);
    }
  };

  const handleDragEnd = useCallback((elementId: string, dx: number, dy: number) => {
    const rX = Math.round(dx);
    const rY = Math.round(dy);
    if(rX === 0 && rY === 0) return;
    
    setOffsets(prev => {
      const activeKey = `${stylePattern}-${orientation}`;
      const activeOffsets = prev[activeKey] || {};
      const current = activeOffsets[elementId] || {x: 0, y: 0};
      return {
        ...prev,
        [activeKey]: {
          ...activeOffsets,
          [elementId]: {
            x: current.x + rX,
            y: current.y + rY
          }
        }
      };
    });
  }, [stylePattern, orientation]);

  const handleBlockStyleChange = (key: string, value: string | number | boolean, blockIdOverride?: string) => {
    const targetId = blockIdOverride || selectedBlockId;
    if (!targetId) return;
    setBlockStyles(prev => {
      const activeKey = `${stylePattern}-${orientation}`;
      const activeStyles = prev[activeKey] || {};
      return {
        ...prev,
        [activeKey]: {
          ...activeStyles,
          [targetId]: {
            ...(activeStyles[targetId] || {}),
            [key]: value
          }
        }
      };
    });
  };

  const savePreset = (name: string) => {
    const newPreset = {
      id: name, // Key by name so we update if it exists
      name,
      state: {
        imageUrl, kicker, heading, body, meta1, meta2, orientation, stylePattern, offsets, blockStyles
      }
    };
    setPresets(prev => {
      const idx = prev.findIndex(p => p.id === name);
      if (idx >= 0) {
        const next = [...prev];
        next[idx] = newPreset;
        return next;
      }
      return [...prev, newPreset];
    });
  };

  const loadPreset = (preset: any) => {
    setImageUrl(preset.state.imageUrl);
    setKicker(preset.state.kicker);
    setHeading(preset.state.heading);
    setBody(preset.state.body);
    setMeta1(preset.state.meta1);
    setMeta2(preset.state.meta2);
    setOrientation(preset.state.orientation);
    setStylePattern(preset.state.stylePattern);
    setOffsets(preset.state.offsets);
    setBlockStyles(preset.state.blockStyles || {});
    setSelectedBlockId(null);
  };
  
  const deletePreset = (id: string) => {
    setPresets(prev => prev.filter(p => p.id !== id));
  };

  useEffect(() => {
    const updateScale = () => {
      if (containerRef.current) {
        let { width, height } = containerRef.current.getBoundingClientRect();
        // Adjust for padding so max looks correct
        const scaleX = width / 1200;
        const scaleY = height / 900;
        const baseScale = Math.min(scaleX, scaleY);
        const actualScale = baseScale * (artboardScaleParam / 100);
        setScale(actualScale);
      }
    };
    
    updateScale();
    window.addEventListener('resize', updateScale);
    return () => window.removeEventListener('resize', updateScale);
  }, [artboardScaleParam, sidebarPosition, isSidebarOpen]);

  const handleDownload = useCallback(() => {
    if (canvasRef.current === null) return;
    
    // Hide grid during export
    const wasGridMode = gridMode;
    if (wasGridMode !== 'none') setGridMode('none');
    
    setTimeout(() => {
      toPng(canvasRef.current!, { 
        cacheBust: true, 
        quality: 1,
        pixelRatio: 2,
      })
        .then((dataUrl) => {
          const link = document.createElement('a');
          const now = new Date();
          const yyyy = now.getFullYear();
          const mm = String(now.getMonth() + 1).padStart(2, '0');
          const dd = String(now.getDate()).padStart(2, '0');
          const hh = String(now.getHours()).padStart(2, '0');
          const min = String(now.getMinutes()).padStart(2, '0');
          const ss = String(now.getSeconds()).padStart(2, '0');
          const timestamp = `${yyyy}${mm}${dd}-${hh}${min}${ss}`;
          link.download = `editorial-${stylePattern}-${orientation}-${timestamp}.png`;
          link.href = dataUrl;
          link.click();
          if (wasGridMode !== 'none') setGridMode(wasGridMode);
        })
        .catch((err) => {
          console.error('Failed to export image', err);
          if (wasGridMode !== 'none') setGridMode(wasGridMode);
        });
    }, 100);
  }, [gridMode, stylePattern, orientation]);

  const renderSharedSettings = (tabType: 'image' | 'text') => {
    if (!selectedBlockId) return (
      <div className="bg-[#111418] border border-[#1e252e] rounded-lg p-4 mb-4 text-center shadow-inner">
        <div className="text-[9px] font-bold text-[#4e5d74] tracking-widest flex items-center justify-center gap-2">
          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 15l-2 5L9 9l11 4-5 2zm0 0l5 5M7.188 2.239l.777 2.897M5.136 7.965l-2.898-.777M13.95 4.05l-2.122 2.122m-5.657 5.656l-2.12 2.122"></path></svg>
          SELECT A {tabType.toUpperCase()} TARGET TO EDIT STYLES
        </div>
      </div>
    );

    const blockId = selectedBlockId;
    const isImageBlock = ['bgWrapper', 'bgWrapper2', 'accent1', 'accent2'].includes(blockId);

    if ((tabType === 'image' && !isImageBlock) || (tabType === 'text' && isImageBlock)) {
      return (
        <div className="bg-[#111418] border border-[#1e252e] rounded-lg p-4 mb-4 text-center shadow-inner cursor-pointer hover:bg-[#1e252e]/50 transition-colors" onClick={() => setSelectedBlockId(null)}>
          <div className="text-[9px] font-bold text-[#4e5d74] tracking-widest flex items-center justify-center gap-2 uppercase">
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 15l-2 5L9 9l11 4-5 2zm0 0l5 5M7.188 2.239l.777 2.897M5.136 7.965l-2.898-.777M13.95 4.05l-2.122 2.122m-5.657 5.656l-2.12 2.122"></path></svg>
            OTHER TAB ITEM ACTIVE - CLICK TO CLEAR
          </div>
        </div>
      );
    }

    return (
      <details open className="mb-4 group bg-[#111418] border border-[#1e252e] rounded-lg" key={blockId}>
        <summary className="text-[10px] p-3 font-bold text-[#00ffff] tracking-[0.1em] cursor-pointer hover:bg-[#1e252e]/50 flex items-center justify-between select-none outline-none">
          <div className="flex items-center gap-2">
            <svg className="w-3 h-3 transition-transform group-open:rotate-90 text-[#8a95a3]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path></svg>
            <button 
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                handleBlockStyleChange('isHidden', !(blockStyles[`${stylePattern}-${orientation}`]?.[blockId]?.isHidden), blockId);
              }}
              className={`p-1 rounded transition-all flex items-center justify-center shrink-0 ${blockStyles[`${stylePattern}-${orientation}`]?.[blockId]?.isHidden ? 'bg-red-500/20 text-red-400' : 'text-[#8a95a3] hover:text-[#00ffff]'}`}
              title={blockStyles[`${stylePattern}-${orientation}`]?.[blockId]?.isHidden ? "Show on Canvas" : "Hide from Canvas"}
            >
              {blockStyles[`${stylePattern}-${orientation}`]?.[blockId]?.isHidden ? (
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path><line x1="1" y1="1" x2="23" y2="23"></line></svg>
              ) : (
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle></svg>
              )}
            </button>
            <span>STYLES: {getFriendlyName(blockId)}</span>
          </div>
          <button 
            onClick={(e) => { e.preventDefault(); e.stopPropagation(); setSelectedBlockId(null); }} 
            className="text-[#8a95a3] hover:text-white flex items-center justify-center w-6 h-6 rounded hover:bg-[#1e252e]"
            title="Close Settings Panel"
          >
            <X size={14} />
          </button>
        </summary>
        <div className="p-3 pt-0 space-y-3">
          {/* Settings panel contents will use blockId directly instead of selectedBlockId */}
          <div className="flex flex-col gap-2 border-t border-[#1e252e] pt-3">
              {!isImageBlock && (
              <div className="w-full">
                <div className="text-[8px] font-bold tracking-widest opacity-60 mb-1">TEXT COLOR</div>
              <div className="flex gap-1 overflow-x-auto h-[21px]">
                 <button 
                   className={`px-3 text-[9px] font-bold rounded transition-all ${(blockStyles[`${stylePattern}-${orientation}`]?.[blockId]?.color || '') === '' ? 'bg-[#00ffff] text-black shadow-sm' : 'text-[#8a95a3] hover:text-[#e2e8f0] bg-[#080a0d] border border-[#1e252e]'}`}
                   onClick={(e) => { e.stopPropagation(); handleBlockStyleChange('color', '', blockId); }}
                 >
                   AUTO
                 </button>
                 <label className="flex-[2] relative flex items-center justify-center rounded transition-all cursor-pointer border border-[#1e252e] hover:border-[#4d5e7a] bg-[#080a0d]">
                   <div className="w-full h-full" style={{ backgroundColor: blockStyles[`${stylePattern}-${orientation}`]?.[blockId]?.color || 'transparent' }} />
                   <input 
                     type="color" 
                     className="absolute inset-0 opacity-0 w-full h-full cursor-pointer"
                     value={blockStyles[`${stylePattern}-${orientation}`]?.[blockId]?.color || '#ffffff'}
                     onChange={(e) => { e.stopPropagation(); handleBlockStyleChange('color', e.target.value, blockId); }}
                   />
                 </label>
              </div>
            </div>
            )}
            <div className="w-full">
              <div className="text-[8px] font-bold tracking-widest opacity-60 mb-1">FONT</div>
              <div className="relative border border-[#1e252e] rounded bg-[#080a0d] hover:border-[#4d5e7a] transition-all">
                <div 
                  className="w-full bg-transparent text-white p-1 pr-6 text-[9px] cursor-pointer flex items-center justify-between"
                  onClick={(e) => { e.stopPropagation(); setIsFontDropdownOpen(!isFontDropdownOpen); }}
                  style={{ fontFamily: blockStyles[`${stylePattern}-${orientation}`]?.[blockId]?.fontFamily || 'inherit' }}
                >
                  <span className="truncate">{FONT_OPTIONS.find(f => f.value === (blockStyles[`${stylePattern}-${orientation}`]?.[blockId]?.fontFamily || ''))?.label || 'AUTO'}</span>
                  <svg className="w-3 h-3 text-[#8a95a3] shrink-0 absolute right-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                </div>
                {isFontDropdownOpen && (
                  <>
                    <div className="fixed inset-0 z-[100]" onClick={(e) => { e.stopPropagation(); setIsFontDropdownOpen(false); }} />
                    <div className="absolute z-[101] w-[200px] right-0 mt-1 bg-[#111418] border border-[#1e252e] rounded shadow-xl max-h-[250px] overflow-y-auto">
                      {FONT_OPTIONS.map((f, i) => (
                        <div
                          key={i}
                          className="px-2 py-1.5 text-[9px] text-white hover:bg-[#2d3640] cursor-pointer"
                          style={{ fontFamily: f.value || 'inherit' }}
                          onClick={(e) => {
                            e.stopPropagation();
                            handleBlockStyleChange('fontFamily', f.value, blockId);
                            setIsFontDropdownOpen(false);
                          }}
                        >
                          {f.label}
                        </div>
                      ))}
                    </div>
                  </>
                )}
              </div>
            </div>
            <div className="w-full">
              <div className="text-[8px] font-bold tracking-widest opacity-60 mb-1 flex justify-between">
                <span>LETTER SPACING</span>
                <span className="text-[#00ffff]">{blockStyles[`${stylePattern}-${orientation}`]?.[blockId]?.letterSpacing ?? 0}em</span>
              </div>
              <input 
                type="range" min="-0.2" max="1" step="0.01" 
                className="w-full accent-[#00ffff]"
                value={blockStyles[`${stylePattern}-${orientation}`]?.[blockId]?.letterSpacing ?? 0} 
                onChange={(e) => handleBlockStyleChange('letterSpacing', Number(e.target.value), blockId)} 
              />
            </div>
            <div className="w-full">
              <div className="text-[8px] font-bold tracking-widest opacity-60 mb-1 flex justify-between">
                <span>LINE HEIGHT</span>
                <span className="text-[#00ffff]">{blockStyles[`${stylePattern}-${orientation}`]?.[blockId]?.lineHeight ?? 1.5}</span>
              </div>
              <input 
                type="range" min="0.5" max="3" step="0.05" 
                className="w-full accent-[#00ffff]"
                value={blockStyles[`${stylePattern}-${orientation}`]?.[blockId]?.lineHeight ?? 1.5} 
                onChange={(e) => handleBlockStyleChange('lineHeight', Number(e.target.value), blockId)} 
              />
            </div>
          </div>
          <div className="flex gap-2 border-t border-[#1e252e] pt-3">
            <div className="flex-1">
              <div className="text-[8px] font-bold tracking-widest opacity-60 mb-1">Z-INDEX</div>
              <div className="flex gap-1">
                {[
                   { id: 0, label: 'BG' },
                   { id: 10, label: 'B' },
                   { id: 20, label: 'M' },
                   { id: 30, label: 'F' },
                   { id: 40, label: 'VF' }
                 ].map(z => {
                   const currentStyles = blockStyles[`${stylePattern}-${orientation}`] || {};
                   const currentZ = currentStyles[blockId]?.zIndex;
                   const isActive = currentZ !== undefined ? currentZ === z.id : (blockId === 'bgWrapper' ? z.id === 0 : false);
                   return (
                     <button 
                       key={z.id}
                       className={`flex-1 py-1 text-[9px] font-bold rounded transition-all ${isActive ? 'bg-[#00ffff] text-black shadow-sm' : 'bg-[#080a0d] text-[#8a95a3] hover:text-[#e2e8f0] border border-[#1e252e]'}`}
                       onClick={(e) => { e.stopPropagation(); handleBlockStyleChange('zIndex', z.id, blockId); }}
                     >
                       {z.label}
                     </button>
                   );
                 })}
              </div>
            </div>
            <div className="flex-1 border-l border-[#1e252e] pl-2">
              <div className="text-[8px] font-bold tracking-widest opacity-60 mb-1">SCALE ({blockStyles[`${stylePattern}-${orientation}`]?.[blockId]?.scale || 100}%)</div>
              <input 
                type="range" 
                min="10" max="400" step="5"
                className="w-full accent-[#00ffff] mt-1"
                value={blockStyles[`${stylePattern}-${orientation}`]?.[blockId]?.scale || 100}
                onChange={(e) => handleBlockStyleChange('scale', Number(e.target.value), blockId)}
              />
            </div>
          </div>

          <div className="flex gap-2 pt-2 border-t border-[#1e252e]">
            <div className="flex-1">
               <div className="text-[8px] font-bold tracking-widest opacity-60 mb-1 flex justify-between">
                 <span>WIDTH / W-px</span>
                 <span className="text-[#00ffff]">{blockStyles[`${stylePattern}-${orientation}`]?.[blockId]?.width || 'AUTO'}</span>
               </div>
               <input 
                 type="range" min="0" max="2000" step="10" 
                 className="w-full accent-[#00ffff] mt-1"
                 value={blockStyles[`${stylePattern}-${orientation}`]?.[blockId]?.width || 0} 
                 onChange={(e) => handleBlockStyleChange('width', Number(e.target.value) || undefined, blockId)} 
               />
            </div>
            <div className="flex-1 border-l border-[#1e252e] pl-2">
               <div className="text-[8px] font-bold tracking-widest opacity-60 mb-1 flex justify-between">
                 <span>HEIGHT / H-px</span>
                 <span className="text-[#00ffff]">{blockStyles[`${stylePattern}-${orientation}`]?.[blockId]?.height || 'AUTO'}</span>
               </div>
               <input 
                 type="range" min="0" max="2000" step="10" 
                 className="w-full accent-[#00ffff] mt-1"
                 value={blockStyles[`${stylePattern}-${orientation}`]?.[blockId]?.height || 0} 
                 onChange={(e) => handleBlockStyleChange('height', Number(e.target.value) || undefined, blockId)} 
               />
            </div>
          </div>

          <div className="flex gap-2 pt-2 border-t border-[#1e252e]">
            <div className="flex-[1.5]">
              <div className="text-[8px] font-bold tracking-widest opacity-60 mb-1 flex justify-between">
                <span>ROTATE ({blockStyles[`${stylePattern}-${orientation}`]?.[blockId]?.rotate || 0}°)</span>
                <button 
                  className="text-[7px] text-[#00ffff] hover:text-white"
                  onClick={(e) => { e.stopPropagation(); handleBlockStyleChange('rotate', 0, blockId); }}
                >RESET</button>
              </div>
              <input 
                type="range" 
                min="-180" max="360" step="1"
                className="w-full accent-[#00ffff] mt-1"
                value={blockStyles[`${stylePattern}-${orientation}`]?.[blockId]?.rotate || 0}
                onChange={(e) => handleBlockStyleChange('rotate', Number(e.target.value), blockId)}
              />
            </div>
            {isImageBlock ? (
              <>
                <div className="flex-1 border-l border-[#1e252e] pl-2">
                   <div className="text-[8px] font-bold tracking-widest opacity-60 mb-1 flex justify-between">
                     <span>BORDER (px)</span>
                     <span className="text-[#00ffff]">{blockStyles[`${stylePattern}-${orientation}`]?.[blockId]?.borderWidth || 0}px</span>
                   </div>
                   <input 
                     type="range" min="0" max="40" step="1" 
                     className="w-full accent-[#00ffff] mt-1"
                     value={blockStyles[`${stylePattern}-${orientation}`]?.[blockId]?.borderWidth || 0} 
                     onChange={(e) => handleBlockStyleChange('borderWidth', Number(e.target.value), blockId)} 
                   />
                </div>
                <div className="flex-1 border-l border-[#1e252e] pl-2">
                   <div className="text-[8px] font-bold tracking-widest opacity-60 mb-1 flex justify-between">
                     <span>RADIUS (px)</span>
                     <span className="text-[#00ffff]">{blockStyles[`${stylePattern}-${orientation}`]?.[blockId]?.borderRadius || 0}px</span>
                   </div>
                   <input 
                     type="range" min="0" max="500" step="1" 
                     className="w-full accent-[#00ffff] mt-1"
                     value={blockStyles[`${stylePattern}-${orientation}`]?.[blockId]?.borderRadius || 0} 
                     onChange={(e) => handleBlockStyleChange('borderRadius', Number(e.target.value), blockId)} 
                   />
                </div>
              </>
            ) : <div className="flex-[2] border-l border-[#1e252e] pl-2"></div>}
          </div>

          <div className="flex gap-2 pt-2 border-t border-[#1e252e]">
              <div className="flex-1">
                 <div className="text-[8px] font-bold tracking-widest opacity-60 mb-1 flex items-center justify-between">
                   <span>OPACITY (%)</span>
                   <span className="text-[#00ffff]">{blockStyles[`${stylePattern}-${orientation}`]?.[blockId]?.opacity !== undefined ? blockStyles[`${stylePattern}-${orientation}`]?.[blockId]?.opacity : 100}%</span>
                 </div>
                 <input 
                   type="range" min="0" max="100" step="1" 
                   className="w-full accent-[#00ffff] mt-1"
                   value={blockStyles[`${stylePattern}-${orientation}`]?.[blockId]?.opacity !== undefined ? blockStyles[`${stylePattern}-${orientation}`]?.[blockId]?.opacity : 100} 
                   onChange={(e) => handleBlockStyleChange('opacity', Number(e.target.value), blockId)} 
                 />
              </div>

               <div className="flex-1 border-l border-[#1e252e] pl-2 flex flex-col justify-center">
                 <div className="text-[8px] font-bold tracking-widest opacity-60 mb-1">BG COLOR</div>
                 <div className="flex gap-1 h-[21px]">
                   <button
                     className={`px-2 text-[9px] font-bold rounded transition-all bg-[#080a0d] hover:text-[#e2e8f0] border border-[#1e252e] w-[36px] flex items-center justify-center ${blockStyles[`${stylePattern}-${orientation}`]?.[blockId]?.isBgColorOff ? 'text-[#8a95a3]' : 'text-white'}`}
                     onClick={(e) => { e.stopPropagation(); handleBlockStyleChange('isBgColorOff', !blockStyles[`${stylePattern}-${orientation}`]?.[blockId]?.isBgColorOff, blockId); }}
                   >{blockStyles[`${stylePattern}-${orientation}`]?.[blockId]?.isBgColorOff ? 'OFF' : 'ON'}</button>
                   <label className={`flex-1 relative flex items-center justify-center bg-[#080a0d] border border-[#1e252e] rounded overflow-hidden cursor-pointer hover:border-[#4e5d74] ${blockStyles[`${stylePattern}-${orientation}`]?.[blockId]?.isBgColorOff ? 'opacity-30' : ''}`}>
                     <div className="w-full h-full" style={{ backgroundColor: blockStyles[`${stylePattern}-${orientation}`]?.[blockId]?.backgroundColor || 'transparent' }} />
                     <input 
                       type="color" 
                       className="absolute inset-0 opacity-0 w-full h-full cursor-pointer"
                       value={blockStyles[`${stylePattern}-${orientation}`]?.[blockId]?.backgroundColor || '#000000'}
                       onChange={(e) => { 
                         e.stopPropagation(); 
                         handleBlockStyleChange('isBgColorOff', false, blockId);
                         handleBlockStyleChange('backgroundColor', e.target.value, blockId);
                       }}
                     />
                   </label>
                 </div>
              </div>
               <div className="flex-1 border-l border-[#1e252e] pl-2 flex flex-col justify-center">
                 <div className="text-[8px] font-bold tracking-widest opacity-60 mb-1">BORDER COLOR</div>
                 <div className="flex gap-1 h-[21px]">
                   <button
                     className={`px-2 text-[9px] font-bold rounded transition-all bg-[#080a0d] hover:text-[#e2e8f0] border border-[#1e252e] w-[36px] flex items-center justify-center ${blockStyles[`${stylePattern}-${orientation}`]?.[blockId]?.isBorderColorOff ? 'text-[#8a95a3]' : 'text-white'}`}
                     onClick={(e) => { e.stopPropagation(); handleBlockStyleChange('isBorderColorOff', !blockStyles[`${stylePattern}-${orientation}`]?.[blockId]?.isBorderColorOff, blockId); }}
                   >{blockStyles[`${stylePattern}-${orientation}`]?.[blockId]?.isBorderColorOff ? 'OFF' : 'ON'}</button>
                   <label className={`flex-1 relative flex items-center justify-center bg-[#080a0d] border border-[#1e252e] rounded overflow-hidden cursor-pointer hover:border-[#4e5d74] ${blockStyles[`${stylePattern}-${orientation}`]?.[blockId]?.isBorderColorOff ? 'opacity-30' : ''}`}>
                     <div className="w-full h-full" style={{ backgroundColor: blockStyles[`${stylePattern}-${orientation}`]?.[blockId]?.borderColor || 'transparent' }} />
                     <input 
                       type="color" 
                       className="absolute inset-0 opacity-0 w-full h-full cursor-pointer"
                       value={blockStyles[`${stylePattern}-${orientation}`]?.[blockId]?.borderColor || '#ffffff'}
                       onChange={(e) => { 
                         e.stopPropagation(); 
                         handleBlockStyleChange('isBorderColorOff', false, blockId);
                         handleBlockStyleChange('borderColor', e.target.value, blockId);
                       }}
                     />
                   </label>
                 </div>
              </div>
            </div>

          
          {['kicker', 'titleContainer', 'bodyContainer', 'body2Container', 'meta1', 'meta2'].includes(blockId) && (
            <>
              <div className="flex gap-2 pt-2 border-t border-[#1e252e]">
                <div className="flex-1">
                  <div className="text-[8px] font-bold tracking-widest opacity-60 mb-1">{lang === 'jp' ? '文字の向き' : 'TEXT DIRECTION'}</div>
                  <div className="flex gap-1">
                    <button 
                       className={`flex-1 py-1 text-[9px] font-bold rounded transition-all ${(blockStyles[`${stylePattern}-${orientation}`]?.[blockId]?.writingMode || '') === '' ? 'bg-[#00ffff] text-black shadow-sm' : 'bg-[#080a0d] text-[#8a95a3] hover:text-[#e2e8f0] border border-[#1e252e]'}`}
                       onClick={(e) => { e.stopPropagation(); handleBlockStyleChange('writingMode', '', blockId); }}
                    >{lang === 'jp' ? '自動' : 'AUTO'}</button>
                    <button 
                       className={`flex-1 py-1 text-[9px] font-bold rounded transition-all ${(blockStyles[`${stylePattern}-${orientation}`]?.[blockId]?.writingMode || '') === 'horizontal-tb' ? 'bg-[#00ffff] text-black shadow-sm' : 'bg-[#080a0d] text-[#8a95a3] hover:text-[#e2e8f0] border border-[#1e252e]'}`}
                       onClick={(e) => { e.stopPropagation(); handleBlockStyleChange('writingMode', 'horizontal-tb', blockId); }}
                    >{lang === 'jp' ? '横' : 'HORZ'}</button>
                    <button 
                       className={`flex-1 py-1 text-[9px] font-bold rounded transition-all ${(blockStyles[`${stylePattern}-${orientation}`]?.[blockId]?.writingMode || '') === 'vertical-rl' ? 'bg-[#00ffff] text-black shadow-sm' : 'bg-[#080a0d] text-[#8a95a3] hover:text-[#e2e8f0] border border-[#1e252e]'}`}
                       onClick={(e) => { e.stopPropagation(); handleBlockStyleChange('writingMode', 'vertical-rl', blockId); }}
                    >{lang === 'jp' ? '縦' : 'VERT'}</button>
                  </div>
                </div>
                <div className="flex-1 border-l border-[#1e252e] pl-2">
                  <div className="text-[8px] font-bold tracking-widest opacity-60 mb-1">ALIGNMENT</div>
                  <div className="flex gap-1">
                    <button 
                      className={`flex-1 py-1 text-[9px] font-bold rounded transition-all ${(blockStyles[`${stylePattern}-${orientation}`]?.[blockId]?.textAlign || '') === '' ? 'bg-[#00ffff] text-black shadow-sm' : 'bg-[#080a0d] text-[#8a95a3] hover:text-[#e2e8f0] border border-[#1e252e]'}`}
                      onClick={(e) => { e.stopPropagation(); handleBlockStyleChange('textAlign', '', blockId); }}
                    >{lang === 'jp' ? '自動' : 'AUTO'}</button>
                    <button 
                      className={`flex-1 py-1 text-[9px] font-bold rounded transition-all ${(blockStyles[`${stylePattern}-${orientation}`]?.[blockId]?.textAlign || '') === 'left' ? 'bg-[#00ffff] text-black shadow-sm' : 'bg-[#080a0d] text-[#8a95a3] hover:text-[#e2e8f0] border border-[#1e252e]'}`}
                      onClick={(e) => { e.stopPropagation(); handleBlockStyleChange('textAlign', 'left', blockId); }}
                    >L</button>
                    <button 
                      className={`flex-1 py-1 text-[9px] font-bold rounded transition-all ${(blockStyles[`${stylePattern}-${orientation}`]?.[blockId]?.textAlign || '') === 'center' ? 'bg-[#00ffff] text-black shadow-sm' : 'bg-[#080a0d] text-[#8a95a3] hover:text-[#e2e8f0] border border-[#1e252e]'}`}
                      onClick={(e) => { e.stopPropagation(); handleBlockStyleChange('textAlign', 'center', blockId); }}
                    >C</button>
                    <button 
                      className={`flex-1 py-1 text-[9px] font-bold rounded transition-all ${(blockStyles[`${stylePattern}-${orientation}`]?.[blockId]?.textAlign || '') === 'right' ? 'bg-[#00ffff] text-black shadow-sm' : 'bg-[#080a0d] text-[#8a95a3] hover:text-[#e2e8f0] border border-[#1e252e]'}`}
                      onClick={(e) => { e.stopPropagation(); handleBlockStyleChange('textAlign', 'right', blockId); }}
                    >R</button>
                    <button 
                      className={`flex-1 py-1 text-[9px] font-bold rounded transition-all ${(blockStyles[`${stylePattern}-${orientation}`]?.[blockId]?.textAlign || '') === 'justify' ? 'bg-[#00ffff] text-black shadow-sm' : 'bg-[#080a0d] text-[#8a95a3] hover:text-[#e2e8f0] border border-[#1e252e]'}`}
                      onClick={(e) => { e.stopPropagation(); handleBlockStyleChange('textAlign', 'justify', blockId); }}
                    >J</button>
                  </div>
                </div>
              </div>
              <div className="flex gap-2 pt-2 border-t border-[#1e252e]">
                <div className="flex-1">
                  <div className="text-[8px] font-bold tracking-widest opacity-60 mb-1">TEXT STROKE</div>
                  <div className="flex gap-1">
                    <button 
                       className={`flex-[1.5] py-1 text-[9px] font-bold rounded transition-all ${(blockStyles[`${stylePattern}-${orientation}`]?.[blockId]?.textStroke || '') === '' ? 'bg-[#00ffff] text-black shadow-sm' : 'bg-[#080a0d] text-[#8a95a3] hover:text-[#e2e8f0] border border-[#1e252e]'}`}
                       onClick={(e) => { e.stopPropagation(); handleBlockStyleChange('textStroke', '', blockId); }}
                    >NONE</button>
                    <button 
                       className={`flex-1 py-1 text-[9px] font-bold rounded transition-all ${(blockStyles[`${stylePattern}-${orientation}`]?.[blockId]?.textStroke || '') === 'white' ? 'bg-[#00ffff] text-black shadow-sm' : 'bg-[#080a0d] text-[#8a95a3] hover:text-[#e2e8f0] border border-[#1e252e]'}`}
                       onClick={(e) => { e.stopPropagation(); handleBlockStyleChange('textStroke', 'white', blockId); }}
                    >WHT</button>
                    <button 
                       className={`flex-1 py-1 text-[9px] font-bold rounded transition-all ${(blockStyles[`${stylePattern}-${orientation}`]?.[blockId]?.textStroke || '') === 'black' ? 'bg-[#00ffff] text-black shadow-sm' : 'bg-[#080a0d] text-[#8a95a3] hover:text-[#e2e8f0] border border-[#1e252e]'}`}
                       onClick={(e) => { e.stopPropagation(); handleBlockStyleChange('textStroke', 'black', blockId); }}
                    >BLK</button>
                    <label className={`flex-1 py-1 min-w-[20px] text-[9px] font-bold rounded transition-all cursor-pointer flex items-center justify-center relative ${(blockStyles[`${stylePattern}-${orientation}`]?.[blockId]?.textStroke && blockStyles[`${stylePattern}-${orientation}`]?.[blockId]?.textStroke !== 'white' && blockStyles[`${stylePattern}-${orientation}`]?.[blockId]?.textStroke !== 'black') ? 'bg-[#00ffff] text-black shadow-sm' : 'bg-[#080a0d] text-[#8a95a3] hover:text-[#e2e8f0] border border-[#1e252e]'}`}>
                      <span>+</span>
                      <input type="color" className="absolute inset-0 opacity-0 w-full h-full cursor-pointer"
                        value={(blockStyles[`${stylePattern}-${orientation}`]?.[blockId]?.textStroke !== 'white' && blockStyles[`${stylePattern}-${orientation}`]?.[blockId]?.textStroke !== 'black') ? (blockStyles[`${stylePattern}-${orientation}`]?.[blockId]?.textStroke || '#ff0000') : '#ff0000'}
                        onChange={(e) => { e.stopPropagation(); handleBlockStyleChange('textStroke', e.target.value, blockId); }}
                      />
                    </label>
                  </div>
                </div>
                <div className="flex-1 border-l border-[#1e252e] pl-2 flex flex-col justify-center">
                  {(blockStyles[`${stylePattern}-${orientation}`]?.[blockId]?.textStroke) ? (
                    <>
                      <div className="text-[8px] font-bold tracking-widest opacity-60 mb-1 flex justify-between">
                        <span>STROKE WIDTH</span>
                        <span className="text-[#00ffff]">{blockStyles[`${stylePattern}-${orientation}`]?.[blockId]?.textStrokeWidth || (blockId === 'titleContainer' ? 2 : blockId === 'kicker' ? 1 : 0.5)}px</span>
                      </div>
                      <input 
                        type="range" min="0.1" max="10" step="0.1" 
                        className="w-full accent-[#00ffff]"
                        value={blockStyles[`${stylePattern}-${orientation}`]?.[blockId]?.textStrokeWidth || (blockId === 'titleContainer' ? 2 : blockId === 'kicker' ? 1 : 0.5)} 
                        onChange={(e) => handleBlockStyleChange('textStrokeWidth', Number(e.target.value), blockId)} 
                      />
                    </>
                ) : (
                    <div className="text-[8px] font-bold tracking-widest opacity-30 text-center">STROKE DISABLED</div>
                )}
                </div>
              </div>
              
              <div className="pt-2 border-t border-[#1e252e]">
                <div className="flex gap-2">
                  <div className="flex-1">
                    <div className="text-[8px] font-bold tracking-widest opacity-60 mb-1">DROP SHADOW</div>
                    <div className="flex gap-1 mb-2">
                      <button 
                         className={`flex-[1.5] py-1 text-[9px] font-bold rounded transition-all ${(blockStyles[`${stylePattern}-${orientation}`]?.[blockId]?.dropShadow || '') === '' ? 'bg-[#00ffff] text-black shadow-sm' : 'bg-[#080a0d] text-[#8a95a3] hover:text-[#e2e8f0] border border-[#1e252e]'}`}
                         onClick={(e) => { e.stopPropagation(); handleBlockStyleChange('dropShadow', '', blockId); }}
                      >NONE</button>
                      <button 
                         className={`flex-1 py-1 text-[9px] font-bold rounded transition-all ${(blockStyles[`${stylePattern}-${orientation}`]?.[blockId]?.dropShadow || '') === 'rgba(255,255,255,0.7)' ? 'bg-[#00ffff] text-black shadow-sm' : 'bg-[#080a0d] text-[#8a95a3] hover:text-[#e2e8f0] border border-[#1e252e]'}`}
                         onClick={(e) => { e.stopPropagation(); handleBlockStyleChange('dropShadow', 'rgba(255,255,255,0.7)', blockId); }}
                      >WHT</button>
                      <button 
                         className={`flex-1 py-1 text-[9px] font-bold rounded transition-all ${(blockStyles[`${stylePattern}-${orientation}`]?.[blockId]?.dropShadow || '') === 'rgba(0,0,0,0.7)' ? 'bg-[#00ffff] text-black shadow-sm' : 'bg-[#080a0d] text-[#8a95a3] hover:text-[#e2e8f0] border border-[#1e252e]'}`}
                         onClick={(e) => { e.stopPropagation(); handleBlockStyleChange('dropShadow', 'rgba(0,0,0,0.7)', blockId); }}
                      >BLK</button>
                      <label className={`flex-1 py-1 min-w-[20px] text-[9px] font-bold rounded transition-all cursor-pointer flex items-center justify-center relative ${(blockStyles[`${stylePattern}-${orientation}`]?.[blockId]?.dropShadow && blockStyles[`${stylePattern}-${orientation}`]?.[blockId]?.dropShadow !== 'rgba(255,255,255,0.7)' && blockStyles[`${stylePattern}-${orientation}`]?.[blockId]?.dropShadow !== 'rgba(0,0,0,0.7)') ? 'bg-[#00ffff] text-black shadow-sm' : 'bg-[#080a0d] text-[#8a95a3] hover:text-[#e2e8f0] border border-[#1e252e]'}`}>
                        <span>+</span>
                        <input type="color" className="absolute inset-0 opacity-0 w-full h-full cursor-pointer"
                          value={(blockStyles[`${stylePattern}-${orientation}`]?.[blockId]?.dropShadow !== 'rgba(255,255,255,0.7)' && blockStyles[`${stylePattern}-${orientation}`]?.[blockId]?.dropShadow !== 'rgba(0,0,0,0.7)') ? (String(blockStyles[`${stylePattern}-${orientation}`]?.[blockId]?.dropShadow).startsWith('#') ? blockStyles[`${stylePattern}-${orientation}`]?.[blockId]?.dropShadow : '#ff0000') : '#ff0000'}
                          onChange={(e) => { e.stopPropagation(); handleBlockStyleChange('dropShadow', e.target.value, blockId); }}
                        />
                      </label>
                    </div>
                  </div>
                  <div className="flex-1 border-l border-[#1e252e] pl-2 flex flex-col justify-center">
                    {(blockStyles[`${stylePattern}-${orientation}`]?.[blockId]?.dropShadow) ? (
                      <div>
                        <div className="text-[8px] font-bold tracking-widest opacity-60 mb-0 flex justify-between">
                          <span>BLUR LVL</span>
                          <span className="text-[#00ffff]">{blockStyles[`${stylePattern}-${orientation}`]?.[blockId]?.dropShadowBlur !== undefined ? blockStyles[`${stylePattern}-${orientation}`]?.[blockId]?.dropShadowBlur : 30}px</span>
                        </div>
                        <input 
                          type="range" min="0" max="40" step="1" 
                          className="w-full accent-[#00ffff]"
                          value={blockStyles[`${stylePattern}-${orientation}`]?.[blockId]?.dropShadowBlur !== undefined ? blockStyles[`${stylePattern}-${orientation}`]?.[blockId]?.dropShadowBlur : 30} 
                          onChange={(e) => handleBlockStyleChange('dropShadowBlur', Number(e.target.value), blockId)} 
                        />
                      </div>
                  ) : (
                      <div className="text-[8px] font-bold tracking-widest opacity-30 text-center">SHADOW DISABLED</div>
                  )}
                  </div>
                </div>
                
                {(blockStyles[`${stylePattern}-${orientation}`]?.[blockId]?.dropShadow) && (
                  <div className="flex gap-2 mt-1">
                    <div className="flex-1">
                      <div className="text-[8px] font-bold tracking-widest opacity-60 mb-0 flex justify-between">
                        <span>OFFSET X</span>
                        <span className="text-[#00ffff]">{blockStyles[`${stylePattern}-${orientation}`]?.[blockId]?.dropShadowX || 0}px</span>
                      </div>
                      <input 
                        type="range" min="-40" max="40" step="1" 
                        className="w-full accent-[#00ffff]"
                        value={blockStyles[`${stylePattern}-${orientation}`]?.[blockId]?.dropShadowX || 0} 
                        onChange={(e) => handleBlockStyleChange('dropShadowX', Number(e.target.value), blockId)} 
                      />
                    </div>
                    <div className="flex-1 border-l border-[#1e252e] pl-2">
                      <div className="text-[8px] font-bold tracking-widest opacity-60 mb-0 flex justify-between">
                        <span>OFFSET Y</span>
                        <span className="text-[#00ffff]">{blockStyles[`${stylePattern}-${orientation}`]?.[blockId]?.dropShadowY !== undefined ? blockStyles[`${stylePattern}-${orientation}`]?.[blockId]?.dropShadowY : 10}px</span>
                      </div>
                      <input 
                        type="range" min="-40" max="40" step="1" 
                        className="w-full accent-[#00ffff]"
                        value={blockStyles[`${stylePattern}-${orientation}`]?.[blockId]?.dropShadowY !== undefined ? blockStyles[`${stylePattern}-${orientation}`]?.[blockId]?.dropShadowY : 10} 
                        onChange={(e) => handleBlockStyleChange('dropShadowY', Number(e.target.value), blockId)} 
                      />
                    </div>
                  </div>
                )}
              </div>
            </>
          )}

          <div className="flex flex-col gap-2 pt-2 border-t border-[#1e252e]">
            <div className="w-full">
              <div className="text-[8px] font-bold tracking-widest opacity-60 mb-1">BG BLUR</div>
              <div className="flex gap-1 overflow-x-auto">
                 {['', 'light', 'dark'].map(blur => {
                    const isActive = (blockStyles[`${stylePattern}-${orientation}`]?.[blockId]?.bgBlur || '') === blur;
                    return (
                       <button 
                         key={blur}
                         className={`flex-1 py-1 text-[9px] font-bold rounded transition-all flex items-center justify-center min-w-[32px] ${isActive ? 'bg-[#00ffff] text-black shadow-sm' : 'bg-[#080a0d] text-[#8a95a3] hover:text-[#e2e8f0] border border-[#1e252e]'}`}
                         onClick={(e) => { e.stopPropagation(); handleBlockStyleChange('bgBlur', blur, blockId); }}
                       >
                         {blur === '' ? 'OFF' : blur.toUpperCase()}
                       </button>
                    );
                 })}
              </div>
            </div>
          </div>
        </div>
      </details>
    );
  };

  return (
    <div className={`w-full h-screen flex ${sidebarPosition === 'right' ? 'flex-row-reverse' : 'flex-row'} theme-${themeMode} bg-[#080a0d] text-[#8a95a3] font-sans overflow-hidden`}>
      {/* Editor Sidebar */}
      <div 
        className={`h-full flex flex-col bg-[#111418] z-20 shrink-0 transition-all duration-300 ease-in-out relative ${sidebarPosition === 'right' ? 'border-l border-[#1e252e]' : 'border-r border-[#1e252e]'}`}
        style={{ 
          width: isSidebarOpen ? '320px' : '0px', 
          overflow: 'hidden',
        }}
      >
        <div className="w-[320px] h-full flex flex-col shrink-0 relative">
          <div className="h-[100px] px-6 border-b border-[#1e252e] shrink-0 bg-[#0a0c10] flex flex-col justify-center gap-1.5">
            <div className="flex items-center gap-3">
              <div className="border border-[#4e5d74] p-1 rounded-md shrink-0 bg-[#111418]">
                <LayoutTemplate size={26} className="text-[#e2e8f0]" />
              </div>
              <h1 className="text-white font-black tracking-[0.2em] text-[15px] leading-[1.2]">
                SOLID DESIGN<br />EDITORIZER
              </h1>
            </div>
            <p className="text-[9px] text-[#4e5d74] tracking-[0.1em] font-bold leading-none pl-1" style={{ fontFamily: '"Share Tech Mono", monospace' }}>GENERATIVE WEB BUILDER</p>
          </div>
          <div className="flex border-b border-[#1e252e] bg-[#080a0d] px-5 py-3 shrink-0">
            <div className="flex items-center gap-1 bg-[#111418] border border-[#1e252e] rounded p-1 w-full">
              <button 
                className={`flex-1 py-1.5 text-[10px] font-bold tracking-widest rounded transition-all ${orientation === 'horizontal' ? 'bg-[#2d3640] text-[#00ffff] shadow-sm' : 'text-[#8a95a3] hover:text-[#e2e8f0]'}`}
                onClick={() => setOrientation('horizontal')}
                title="横組レギュラー"
              >{lang === 'jp' ? '☰ 横組' : '☰ REGULAR'}</button>
              <button 
                className={`flex-1 py-1.5 text-[10px] font-bold tracking-widest rounded transition-all ${orientation === 'vertical' ? 'bg-[#2d3640] text-[#00ffff] shadow-sm' : 'text-[#8a95a3] hover:text-[#e2e8f0]'}`}
                onClick={() => setOrientation('vertical')}
                title="縦組リール"
              >{lang === 'jp' ? '|| 縦組' : '|| REELS'}</button>
            </div>
          </div>
          
          <div className="flex border-b border-[#1e252e] bg-[#080a0d] px-5 py-2 shrink-0">
            <div className="flex gap-4 w-full">
              <button 
                className={`flex-1 py-2 text-[10px] font-bold tracking-widest rounded-md transition-all ${activeTab === 'design' ? 'bg-[#1a1f26] text-white shadow-sm border border-[#2d3640]' : 'text-[#8a95a3] hover:text-[#e2e8f0] border border-transparent'}`}
                onClick={() => setActiveTab('design')}
              >{lang === 'jp' ? 'デザイン' : 'DESIGN'}</button>
              <button 
                className={`flex-1 py-2 text-[10px] font-bold tracking-widest rounded-md transition-all ${activeTab === 'image' ? 'bg-[#1a1f26] text-white shadow-sm border border-[#2d3640]' : 'text-[#8a95a3] hover:text-[#e2e8f0] border border-transparent'}`}
                onClick={() => setActiveTab('image')}
              >{lang === 'jp' ? '画像' : 'IMAGE'}</button>
              <button 
                className={`flex-1 py-2 text-[10px] font-bold tracking-widest rounded-md transition-all ${activeTab === 'text' ? 'bg-[#1a1f26] text-white shadow-sm border border-[#2d3640]' : 'text-[#8a95a3] hover:text-[#e2e8f0] border border-transparent'}`}
                onClick={() => setActiveTab('text')}
              >{lang === 'jp' ? 'テキスト' : 'TEXT'}</button>
            </div>
          </div>

        {/* Display Panel - Indicator of selected element */}
        {/* property panel removed */}

        <div className="flex-1 relative overflow-y-auto overflow-x-visible p-5 pb-32 custom-scrollbar">
          
          {activeTab === 'image' && (
            <div className="space-y-6">
              {renderSharedSettings('image')}
              
              <div className="space-y-4">
                <div className="ss-label"><ImageIcon size={14}/><span>PHOTO ASSETS</span></div>
                
                {/* DIRECT UPLOAD SECTION */}
                <div className="grid grid-cols-1 gap-3">
                  {/* IMAGE 1 */}
                  <div className="bg-[#111418] border border-[#1e252e] p-3 rounded-lg flex flex-col gap-3">
                    <div className="text-[9px] font-bold tracking-widest opacity-60 uppercase flex items-center justify-between">
                       <div className="flex items-center gap-1">
                         <span>IMAGE 1 UPLOAD</span>
                         <TargetButton blockId="bgWrapper" />
                       </div>
                       {imageUrl && <button onClick={() => setImageUrl('')} className="hover:text-red-400"><Trash2 size={10}/></button>}
                    </div>
                    <label 
                      className="flex-1 flex flex-col items-center justify-center border-2 border-dashed border-[#1e252e] rounded-md p-2 bg-[#080a0d] hover:bg-[#111418] hover:border-[#4e5d74] transition-all cursor-pointer relative overflow-hidden group min-h-[60px]"
                      onDragOver={(e) => { e.preventDefault(); e.stopPropagation(); }}
                      onDrop={(e) => {
                        e.preventDefault(); e.stopPropagation();
                        const file = e.dataTransfer.files?.[0];
                        if (file && file.type.startsWith('image/')) {
                          const r = new FileReader(); r.onload = (ev) => setImageUrl(ev.target?.result as string); r.readAsDataURL(file);
                        }
                      }}
                    >
                      <input type="file" accept="image/*" className="hidden" onChange={(e) => {
                        const file = e.target.files?.[0];
                        if(file) { const r = new FileReader(); r.onload = (ev) => setImageUrl(ev.target?.result as string); r.readAsDataURL(file); }
                      }} />
                      {imageUrl && imageUrl !== DEFAULT_IMAGE ? (
                        <div className="absolute inset-0 z-0 opacity-40 select-none pointer-events-none group-hover:opacity-20 transition-opacity">
                          <img src={imageUrl} alt="bg" className="w-full h-full object-cover blur-[2px]" />
                        </div>
                      ) : null}
                      <span className="text-[9px] font-bold text-[#4e5d74] z-10 text-center tracking-wider leading-tight">DROP MSG<br/>OR CLICK</span>
                    </label>
                    {/* renderBlockSettings removed */}
                  </div>

                  {/* IMAGE 2 */}
                  <div className="bg-[#111418] border border-[#1e252e] p-3 rounded-lg flex flex-col gap-3">
                    <div className="text-[9px] font-bold tracking-widest opacity-60 uppercase flex items-center justify-between">
                       <div className="flex items-center gap-1">
                         <span>IMAGE 2 UPLOAD</span>
                         <TargetButton blockId="bgWrapper2" />
                       </div>
                       {image2Url && <button onClick={() => setImage2Url('')} className="hover:text-red-400"><Trash2 size={10}/></button>}
                    </div>
                    <label 
                      className="flex-1 flex flex-col items-center justify-center border-2 border-dashed border-[#1e252e] rounded-md p-2 bg-[#080a0d] hover:bg-[#111418] hover:border-[#4e5d74] transition-all cursor-pointer relative overflow-hidden group min-h-[60px]"
                      onDragOver={(e) => { e.preventDefault(); e.stopPropagation(); }}
                      onDrop={(e) => {
                        e.preventDefault(); e.stopPropagation();
                        const file = e.dataTransfer.files?.[0];
                        if (file && file.type.startsWith('image/')) {
                          const r = new FileReader(); r.onload = (ev) => setImage2Url(ev.target?.result as string); r.readAsDataURL(file);
                        }
                      }}
                    >
                      <input type="file" accept="image/*" className="hidden" onChange={(e) => {
                        const file = e.target.files?.[0];
                        if(file) { const r = new FileReader(); r.onload = (ev) => setImage2Url(ev.target?.result as string); r.readAsDataURL(file); }
                      }} />
                      {image2Url ? (
                        <div className="absolute inset-0 z-0 opacity-40 select-none pointer-events-none group-hover:opacity-20 transition-opacity">
                          <img src={image2Url} alt="bg" className="w-full h-full object-cover blur-[2px]" />
                        </div>
                      ) : null}
                      <span className="text-[9px] font-bold text-[#4e5d74] z-10 text-center tracking-wider leading-tight">DROP MSG<br/>OR CLICK</span>
                    </label>
                    {/* renderBlockSettings removed */}
                  </div>
                </div>
              </div>

              <div className="space-y-4 pt-6 border-t border-[#1e252e]">
                <div className="ss-label"><Layers size={14}/><span>ACCENT BLOCKS</span></div>
                <div className="grid grid-cols-1 gap-3">
                   <div className="bg-[#111418] border border-[#1e252e] p-3 rounded-lg flex flex-col justify-center items-center gap-3">
                     <span className="text-[9px] font-bold tracking-widest opacity-60 uppercase flex items-center justify-between w-full">
                       <span>ACCENT BLOCK 1</span>
                       <TargetButton blockId="accent1" />
                     </span>
                     {/* renderBlockSettings removed */}
                   </div>
                   <div className="bg-[#111418] border border-[#1e252e] p-3 rounded-lg flex flex-col justify-center items-center gap-3">
                     <span className="text-[9px] font-bold tracking-widest opacity-60 uppercase flex items-center justify-between w-full">
                       <span>ACCENT BLOCK 2</span>
                       <TargetButton blockId="accent2" />
                     </span>
                     {/* renderBlockSettings removed */}
                   </div>
                </div>
              </div>
            </div>

          )}
          {activeTab === 'text' && (
            <div className="space-y-6">
              {renderSharedSettings('text')}

              <div className="space-y-4">
                <div className="ss-label"><Type size={14}/><span>TYPOGRAPHY DATA</span></div>
                
                <div className="grid grid-cols-2 gap-3">
                  <div className="col-span-2">
                    <div className="text-[9px] mb-1.5 font-bold tracking-widest opacity-60 flex items-center justify-between">
                       <span>KICKER TAG</span>
                       <TargetButton blockId="kicker" />
                    </div>
                    <input type="text" className="ss-input rounded-md w-full" value={kicker} onChange={(e)=>setKicker(e.target.value)} />
                    {/* renderBlockSettings removed */}
                  </div>
                  <div className="col-span-2">
                    <div className="text-[9px] mb-1.5 font-bold tracking-widest opacity-60 flex items-center justify-between">
                       <span>HEADLINE</span>
                       <TargetButton blockId="titleContainer" />
                    </div>
                    <textarea className="ss-input h-16 resize-none rounded-md w-full" value={heading} onChange={(e)=>setHeading(e.target.value)} />
                    {/* renderBlockSettings removed */}
                  </div>
                  <div className="col-span-2">
                    <div className="text-[9px] mb-1.5 font-bold tracking-widest opacity-60 flex items-center justify-between">
                       <span>BODY TEXT 1 (PARAGRAPHS = NEW LINE)</span>
                       <TargetButton blockId="bodyContainer" />
                    </div>
                    <textarea className="ss-input h-24 resize-none rounded-md leading-relaxed text-[11px] w-full" value={body} onChange={(e)=>setBody(e.target.value)} />
                    {/* renderBlockSettings removed */}
                  </div>
                  <div className="col-span-2">
                    <div className="text-[9px] mb-1.5 font-bold tracking-widest opacity-60 flex items-center justify-between">
                       <span>BODY TEXT 2 (PARAGRAPHS = NEW LINE)</span>
                       <TargetButton blockId="body2Container" />
                    </div>
                    <textarea className="ss-input h-24 resize-none rounded-md leading-relaxed text-[11px] placeholder:text-[#2d3a4d]/50 w-full" placeholder="Optional second body text block..." value={body2} onChange={(e)=>setBody2(e.target.value)} />
                    {/* renderBlockSettings removed */}
                  </div>
                  <div className="col-span-2 sm:col-span-1">
                    <div className="text-[9px] mb-1.5 font-bold tracking-widest opacity-60 flex items-center justify-between">
                       <span>META 1</span>
                       <TargetButton blockId="meta1" />
                    </div>
                    <input type="text" className="ss-input rounded-md w-full" value={meta1} onChange={(e)=>setMeta1(e.target.value)} />
                    {/* renderBlockSettings removed */}
                  </div>
                  <div className="col-span-2 sm:col-span-1">
                    <div className="text-[9px] mb-1.5 font-bold tracking-widest opacity-60 flex items-center justify-between">
                       <span>META 2</span>
                       <TargetButton blockId="meta2" />
                    </div>
                    <input type="text" className="ss-input rounded-md w-full" value={meta2} onChange={(e)=>setMeta2(e.target.value)} />
                    {/* renderBlockSettings removed */}
                  </div>
                </div>
              </div>
            </div>
          )}
          {activeTab === 'design' && (
            <div className="space-y-6">

              <div className="space-y-3">
                <div className="flex items-center justify-between mb-2">
                  <div className="ss-label mb-0"><Grid size={14}/><span>FORMATION GRID</span></div>
                  <div className="flex gap-2">
                    <button 
                      className={`px-1.5 py-1 text-[9px] font-bold tracking-widest rounded transition-all flex items-center justify-center gap-1 border ${isMonotone ? 'bg-blue-600/20 text-blue-400 border-blue-500/30' : 'bg-[#080a0d] text-[#8a95a3] hover:text-[#e2e8f0] border-[#1e252e]'}`}
                      onClick={() => setIsMonotone(!isMonotone)}
                    >
                      <ImageIcon size={10}/> {isMonotone ? 'MONO: ON' : 'MONO: OFF'}
                    </button>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  {[
                    { id: 'impact', label: 'IMPACT', desc: lang === 'jp' ? 'ダイナミック' : 'DYNAMIC' },
                    { id: 'story', label: 'STORY', desc: lang === 'jp' ? 'エディトリアル' : 'EDITORIAL' },
                    { id: 'gallery', label: 'GALLERY', desc: lang === 'jp' ? 'アートギャラリー' : 'ART GALLERY' },
                    { id: 'magazine', label: 'MAGAZINE', desc: lang === 'jp' ? '雑誌カバー' : 'MAGAZINE COVER' },
                    { id: 'split', label: 'SPLIT', desc: lang === 'jp' ? 'コントラスト' : 'SPLIT CONTRAST' },
                    { id: 'blank', label: 'BLANK', desc: lang === 'jp' ? '自由配置' : 'FREE LAYOUT' }
                  ].map(f => (
                    <div key={f.id} className="relative group">
                      <button 
                        onClick={() => setStylePattern(f.id)}
                        className={`w-full flex flex-col p-2.5 border rounded-lg transition-all text-left ${
                          stylePattern === f.id 
                            ? 'border-[#8a95a3] bg-[#1a1f26]' 
                            : 'border-[#1e252e] bg-[#080a0d] hover:border-[#2d3a4d]'
                        }`}
                      >
                        <span className={`text-[11px] font-black tracking-widest ${stylePattern === f.id ? 'text-white' : 'text-[#8a95a3]'}`}>{f.label}</span>
                        <span className="text-[9px] opacity-60 mt-0.5">{f.desc}</span>
                      </button>
                      <button
                        className={`absolute top-1.5 right-1.5 p-1 rounded transition-all opacity-0 group-hover:opacity-100 bg-[#0a0c10] border border-[#1e252e] hover:border-[#4d5e7a] text-[#8a95a3] hover:text-[#00ffff]`}
                        title={lang === 'jp' ? '配置とスタイルをリセット' : 'Reset Offset & Style'}
                        onClick={(e) => {
                          e.stopPropagation();
                          setResetConfirmTarget(f.id);
                        }}
                      >
                        <RotateCcw size={10} />
                      </button>
                    </div>
                  ))}
                </div>
                <div className="flex gap-2 mt-2">
                  <button 
                    className={`flex-1 py-1.5 text-[10px] font-bold tracking-widest rounded-md transition-all flex items-center justify-center gap-1.5 border border-[#1e252e] bg-[#080a0d] hover:bg-[#1e252e] text-[#8a95a3]`}
                    onClick={() => {
                      setOffsets(prev => ({...prev, [`${stylePattern}-${orientation}`]: {}}));
                    }}
                  >
                    <RotateCcw size={12}/> {lang === 'jp' ? '配置リセット' : 'UN-OFFSET'}
                  </button>
                  <button 
                    className={`flex-1 py-1.5 text-[10px] font-bold tracking-widest rounded-md transition-all flex items-center justify-center gap-1.5 border border-[#1e252e] bg-[#080a0d] hover:bg-[#1e252e] text-[#8a95a3] hover:text-[#00ffff]`}
                    onClick={() => {
                      setResetConfirmTarget('all');
                    }}
                  >
                    <RotateCcw size={12}/> {lang === 'jp' ? 'すべてリセット' : 'RESET ALL'}
                  </button>
                </div>
              </div>

              <div className="space-y-4 pt-6 border-t border-[#1e252e]">
                <div className="ss-label flex justify-between items-center">
                  <span className="flex items-center gap-1"><Settings2 size={14}/><span>OPTIONS & GRID</span></span>
                  <button 
                    className={`px-2 py-0.5 text-[9px] font-bold border rounded transition-all ${gridMode !== 'none' ? 'bg-[#00ffff] text-black border-[#00ffff] shadow-[0_0_10px_rgba(0,255,255,0.5)]' : 'bg-[#1e252e] text-[#8a95a3] border-[#1e252e] hover:border-[#4e5d74]'}`}
                    onClick={() => setGridMode(gridMode === 'none' ? gridColor : 'none')}
                  >
                    {gridMode !== 'none' ? 'ON' : 'OFF'}
                  </button>
                </div>

                <div className="flex bg-[#080a0d] p-1.5 rounded-lg border border-[#1e252e] gap-1.5 flex-wrap">
                  <button 
                    className={`flex-1 min-w-[50px] py-1.5 text-[10px] font-bold tracking-widest rounded-md transition-all flex items-center justify-center gap-1.5 ${gridColor === 'cyan' ? 'bg-[#2d3640] text-[#00ffff] shadow-sm' : 'text-[#8a95a3] hover:text-[#e2e8f0]'}`}
                    onClick={() => {
                      setGridColor('cyan');
                      if (gridMode !== 'none') setGridMode('cyan');
                    }}
                  >
                    CYAN
                  </button>
                  <button 
                    className={`flex-1 min-w-[50px] py-1.5 text-[10px] font-bold tracking-widest rounded-md transition-all flex items-center justify-center gap-1.5 ${gridColor === 'dark' ? 'bg-[#2d3640] text-white shadow-sm' : 'text-[#8a95a3] hover:text-[#e2e8f0]'}`}
                    onClick={() => {
                      setGridColor('dark');
                      if (gridMode !== 'none') setGridMode('dark');
                    }}
                  >
                    DARK
                  </button>
                  <button 
                    className={`flex-1 min-w-[50px] py-1.5 text-[10px] font-bold tracking-widest rounded-md transition-all flex items-center justify-center gap-1.5 ${gridColor === 'light' ? 'bg-[#2d3640] text-white shadow-sm' : 'text-[#8a95a3] hover:text-[#e2e8f0]'}`}
                    onClick={() => {
                      setGridColor('light');
                      if (gridMode !== 'none') setGridMode('light');
                    }}
                  >
                    LIGHT
                  </button>
                </div>
              </div>

              <div className="space-y-4 pt-6 border-t border-[#1e252e]">
                <div className="ss-label"><Save size={14}/><span>SAVE SLOTS</span></div>
                <div className="grid grid-cols-2 gap-2">
                  {[1, 2, 3, 4].map(slot => {
                    const isSaved = filledSlots.includes(slot);
                    return (
                      <div key={slot} className="flex flex-col bg-[#1a1f26] border border-[#1e252e] rounded-md overflow-hidden relative group h-[60px]">
                        {isSaved ? (
                          <div className="flex flex-col h-full">
                             <button 
                               className="flex-1 text-[10px] font-bold tracking-widest text-[#00ffff] hover:bg-[#2d3640] transition-colors flex items-center justify-center pt-1"
                               onClick={() => loadSlot(slot)}
                             >
                               LOAD SLOT {slot}
                             </button>
                             <div className="flex border-t border-[#1e252e] h-[24px] shrink-0">
                               <button 
                                 className="flex-1 text-[9px] font-bold tracking-widest text-[#8a95a3] hover:text-white border-r border-[#1e252e] hover:bg-[#4e5d74] transition-colors flex items-center justify-center gap-1"
                                 onClick={() => {
                                   const data = { imageUrl, image2Url, kicker, heading, body, body2, meta1, meta2, orientation, stylePattern, gridMode, isMonotone, blockStyles, offsets };
                                   localStorage.setItem(`solid-design-slot-${slot}`, JSON.stringify(data));
                                   setFilledSlots(prev => prev.includes(slot) ? prev : [...prev, slot]);
                                 }}
                               ><Save size={10}/> SAVE</button>
                               <button 
                                 className="flex-1 text-[9px] font-bold tracking-widest text-[#8a95a3] hover:text-white hover:bg-red-900 transition-colors flex items-center justify-center gap-1"
                                 onClick={() => {
                                   localStorage.removeItem(`solid-design-slot-${slot}`);
                                   setFilledSlots(prev => prev.filter(s => s !== slot));
                                 }}
                               ><Trash2 size={10}/> DEL</button>
                             </div>
                          </div>
                      ) : (
                          <button 
                            className="h-full w-full text-[10px] font-bold tracking-widest text-[#8a95a3] hover:text-[#e2e8f0] hover:bg-[#2d3640] transition-colors flex flex-col items-center justify-center gap-1"
                            onClick={() => {
                              const data = { imageUrl, image2Url, kicker, heading, body, body2, meta1, meta2, orientation, stylePattern, gridMode, isMonotone, blockStyles, offsets };
                              localStorage.setItem(`solid-design-slot-${slot}`, JSON.stringify(data));
                              setFilledSlots(prev => [...prev, slot]);
                            }}
                          >
                            <span className="opacity-50 text-[16px] leading-none mb-1">+</span>
                            SAVE SLOT {slot}
                          </button>
                        )}
                      </div>
                    );
                  })}
                </div>

              </div>
            </div>
          )}
        </div>
        <div className="p-4 border-t border-[#1e252e] bg-[#0a0c10] space-y-2">
          <div className="grid grid-cols-2 gap-1.5">
            <button 
              className={`col-span-1 py-1.5 text-[10px] font-bold tracking-widest rounded-md transition-all flex items-center justify-center gap-1.5 border border-[#1e252e] ${isSaving ? 'bg-blue-600 text-white' : 'bg-[#080a0d] hover:bg-[#1e252e] text-[#8a95a3]'}`}
              onClick={handleManualSave}
            >
              <Save size={12}/> {lang === 'jp' ? '一時保存' : 'SAVE SLOT 1'}
            </button>
            <button 
              className="col-span-1 py-1.5 text-[10px] font-bold tracking-widest rounded-md transition-all flex items-center justify-center gap-1.5 border border-[#2d3640] bg-[#111418] hover:bg-[#1e252e] text-white"
              onClick={handleDownload}
            >
              <Download size={12} /> {lang === 'jp' ? '画像DL' : 'DL IMAGE'}
            </button>
          </div>
          <div className="grid grid-cols-2 gap-1.5">
            <button 
              className="col-span-1 py-1.5 text-[10px] font-bold tracking-widest rounded-md transition-all flex items-center justify-center gap-1.5 border border-[#1e252e] bg-[#080a0d] hover:bg-[#1e252e] text-[#8a95a3]"
              onClick={() => fileInputRef.current?.click()}
            >
              <FileUp size={12}/> {lang === 'jp' ? 'データ読込' : 'DATA IMPORT'}
            </button>
            <input 
              type="file" 
              accept=".json" 
              ref={fileInputRef} 
              className="hidden" 
              onChange={handleImportProject} 
            />
            <button 
              className="col-span-1 py-1.5 text-[10px] font-bold tracking-widest rounded-md transition-all flex items-center justify-center gap-1.5 border border-[#1e252e] bg-[#080a0d] hover:bg-[#1e252e] text-[#8a95a3]"
              onClick={handleExportProject}
            >
              <FileDown size={12}/> {lang === 'jp' ? 'データ書出' : 'DATA EXPORT'}
            </button>
          </div>
        </div>

        {/* Global Settings Panel (Overlays inside Sidebar) */}
        {isGlobalSettingsOpen && (
          <div 
            className="absolute inset-0 z-50 bg-[#111418] flex flex-col"
          >
            <div className="h-[100px] px-6 flex items-center justify-between border-b border-[#1e252e] shrink-0 bg-[#0a0c10]">
              <div className="flex items-center gap-2">
                <Settings size={16} className="text-[#00ffff]"/>
                <span className="text-[12px] font-bold text-white tracking-widest">{lang === 'jp' ? '表示設定' : 'DISPLAY SETTINGS'}</span>
              </div>
              <button className="text-[#8a95a3] hover:text-white transition-colors" onClick={() => setIsGlobalSettingsOpen(false)}>
                <X size={16} />
              </button>
            </div>

            <div className="p-5 flex-1 overflow-y-auto space-y-6">
              <div>
                <div className="text-[9px] font-bold tracking-widest text-[#4e5d74] mb-2 uppercase">{lang === 'jp' ? '言語' : 'Language'}</div>
                <div className="flex bg-[#111418] border border-[#1e252e] rounded text-[10px] font-bold p-1">
                  <button onClick={() => setLang('en')} className={`flex-1 py-2 rounded-sm transition-colors ${lang === 'en' ? 'bg-[#2d3640] text-[#00ffff]' : 'text-[#8a95a3] hover:text-[#e2e8f0]'}`}>ENGLISH</button>
                  <button onClick={() => setLang('jp')} className={`flex-1 py-2 rounded-sm transition-colors ${lang === 'jp' ? 'bg-[#2d3640] text-[#00ffff]' : 'text-[#8a95a3] hover:text-[#e2e8f0]'}`}>日本語</button>
                </div>
              </div>
              <div>
                <div className="text-[9px] font-bold tracking-widest text-[#4e5d74] mb-2 uppercase">{lang === 'jp' ? 'キャンバス背景色' : 'Canvas Background'}</div>
                <div className="flex items-center gap-3">
                  <div className="relative w-8 h-8 rounded-full overflow-hidden border-2 border-[#1e252e] shrink-0">
                    <input 
                      type="color" 
                      value={canvasBgColor} 
                      onChange={(e) => setCanvasBgColor(e.target.value)}
                      className="absolute -top-2 -left-2 w-12 h-12 cursor-pointer"
                    />
                  </div>
                  <div className="flex-1">
                    <input 
                      type="text" 
                      value={canvasBgColor} 
                      onChange={(e) => setCanvasBgColor(e.target.value)}
                      className="w-full bg-[#0a0c10] border border-[#1e252e] rounded px-3 py-2 text-[10px] font-bold tracking-widest text-[#8a95a3] focus:outline-none focus:border-[#00ffff]"
                    />
                  </div>
                  <div className="flex gap-1 shrink-0">
                    <button onClick={() => setCanvasBgColor('#151515')} className="w-8 h-8 rounded bg-[#151515] border border-[#1e252e] hover:border-[#4e5d74] transition-colors" title="Dark setting"></button>
                    <button onClick={() => setCanvasBgColor('#808080')} className="w-8 h-8 rounded bg-[#808080] border border-[#1e252e] hover:border-[#4e5d74] transition-colors" title="Gray setting"></button>
                    <button onClick={() => setCanvasBgColor('#ffffff')} className="w-8 h-8 rounded bg-[#ffffff] border border-[#1e252e] hover:border-[#4e5d74] transition-colors" title="White setting"></button>
                  </div>
                </div>
              </div>

              <div>
                <div className="text-[9px] font-bold tracking-widest text-[#4e5d74] mb-2 uppercase">{lang === 'jp' ? 'アートボードの影' : 'Artboard Shadow'}</div>
                <div className="flex gap-2">
                  <button onClick={() => setArtboardShadow(true)} className={`flex-1 py-2 text-[10px] font-bold border rounded ${artboardShadow ? 'bg-[#2d3640] text-[#00ffff] border-[#4e5d74]' : 'bg-[#0a0c10] text-[#8a95a3] border-[#1e252e] hover:text-[#e2e8f0]'}`}>{lang === 'jp' ? 'オン' : 'ON'}</button>
                  <button onClick={() => setArtboardShadow(false)} className={`flex-1 py-2 text-[10px] font-bold border rounded ${!artboardShadow ? 'bg-[#2d3640] text-[#00ffff] border-[#4e5d74]' : 'bg-[#0a0c10] text-[#8a95a3] border-[#1e252e] hover:text-[#e2e8f0]'}`}>{lang === 'jp' ? 'オフ' : 'OFF'}</button>
                </div>
              </div>
              <div>
                <div className="flex justify-between items-end mb-2">
                  <div className="text-[9px] font-bold tracking-widest text-[#4e5d74] uppercase">{lang === 'jp' ? 'ステータスパネル' : 'Status Panel'}</div>
                  <div className="text-[10px] font-bold text-[#00ffff]">{showStatusText ? `${statusOpacity}%` : (lang === 'jp' ? 'オフ' : 'OFF')}</div>
                </div>
                <div className="flex gap-2 mb-3">
                  <button onClick={() => setShowStatusText(true)} className={`flex-1 py-2 text-[10px] font-bold border rounded ${showStatusText ? 'bg-[#2d3640] text-[#00ffff] border-[#4e5d74]' : 'bg-[#0a0c10] text-[#8a95a3] border-[#1e252e] hover:text-[#e2e8f0]'}`}>{lang === 'jp' ? '表示' : 'SHOW'}</button>
                  <button onClick={() => setShowStatusText(false)} className={`flex-1 py-2 text-[10px] font-bold border rounded ${!showStatusText ? 'bg-[#2d3640] text-[#00ffff] border-[#4e5d74]' : 'bg-[#0a0c10] text-[#8a95a3] border-[#1e252e] hover:text-[#e2e8f0]'}`}>{lang === 'jp' ? '非表示' : 'HIDE'}</button>
                </div>
                {showStatusText && (
                  <div className="flex flex-col gap-5 mt-5 mb-2">
                    <input 
                      type="range" 
                      min="10" 
                      max="100" 
                      value={statusOpacity}
                      onChange={(e) => setStatusOpacity(Number(e.target.value))}
                      className="w-full accent-[#00ffff] py-2 cursor-pointer"
                    />
                    <div className="flex gap-2">
                      <button onClick={() => setStatusTheme('dark')} className={`flex-1 py-2 text-[10px] font-bold border rounded ${statusTheme === 'dark' ? 'bg-[#2d3640] text-[#00ffff] border-[#4e5d74]' : 'bg-[#0a0c10] text-[#8a95a3] border-[#1e252e] hover:text-[#e2e8f0]'}`}>{lang === 'jp' ? 'ダーク' : 'DARK'}</button>
                      <button onClick={() => setStatusTheme('light')} className={`flex-1 py-2 text-[10px] font-bold border rounded ${statusTheme === 'light' ? 'bg-[#2d3640] text-[#00ffff] border-[#4e5d74]' : 'bg-[#0a0c10] text-[#8a95a3] border-[#1e252e] hover:text-[#e2e8f0]'}`}>{lang === 'jp' ? 'ライト' : 'LIGHT'}</button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
        </div>
      </div>
        <div ref={panelConstraintsRef} className="absolute inset-[30px] pointer-events-none" />
      
      {/* Main Content Area (Header + Canvas) */}
      <div className="flex-1 flex flex-col relative overflow-hidden">
        
      {/* Header Container */}
      <AnimatePresence>
        {isHeaderOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="w-full bg-[#0a0c10] border-b border-[#1e252e] shrink-0 overflow-hidden relative z-[60] flex flex-col justify-center"
          >
            <div className="flex items-center justify-end px-6 py-4">
              {/* Right Side: Controls */}
              <div className="flex items-center gap-6">
                 {/* Mode Toggle */}
                 <div className="flex items-center gap-2">
                    <AnimatePresence>
                      {isEditMode && (
                        <motion.div 
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0, x: -10 }}
                          className="mr-2"
                        >
                          <div className="h-[28px] px-3 text-[9px] font-bold tracking-widest flex items-center gap-2 rounded-full bg-[#111418] border border-[#2d3640] text-[#00ffff] shadow-sm">
                            <span className="w-1.5 h-1.5 rounded-full animate-pulse bg-[#00ffff]"></span>
                            {lang === 'jp' ? 'デザインモード' : 'DESIGN MODE'}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                    <span className="text-[9px] font-bold tracking-widest text-[#4e5d74] mr-2">{lang === 'jp' ? 'モード' : 'MODE'}</span>
                    <div className="flex bg-[#111418] border border-[#1e252e] rounded text-[9px] font-bold p-0.5 h-[28px]">
                      <button onClick={() => setIsEditMode(true)} className={`px-3 h-full flex items-center justify-center rounded-sm transition-colors ${isEditMode ? 'bg-[#2d3640] text-[#00ffff]' : 'text-[#8a95a3] hover:text-[#e2e8f0]'}`}>{lang === 'jp' ? '編集' : 'EDIT'}</button>
                      <button onClick={() => { setIsEditMode(false); setSelectedBlockId(null); }} className={`px-3 h-full flex items-center justify-center rounded-sm transition-colors ${!isEditMode ? 'bg-[#2d3640] text-[#00ffff]' : 'text-[#8a95a3] hover:text-[#e2e8f0]'}`}>{lang === 'jp' ? 'プレビュー' : 'PREVIEW'}</button>
                    </div>
                 </div>

                 {/* Artboard Scale */}
                 <div className="flex items-center gap-3 border-l border-[#1e252e] pl-6">
                    <span className="text-[9px] font-bold tracking-widest text-[#4e5d74] mr-1">{lang === 'jp' ? 'ズーム' : 'SCALE'}</span>
                    <input 
                      type="range" 
                      min="10" 
                      max="300" 
                      value={artboardScaleParam}
                      onChange={(e) => setArtboardScaleParam(Number(e.target.value))}
                      className="w-[100px] accent-[#00ffff] h-1 bg-[#1e252e] rounded-lg "
                    />
                    <span className="text-[9px] font-bold text-[#00ffff] w-[30px] text-right">{Math.round(artboardScaleParam)}%</span>
                 </div>

                 {/* Sidebar Position */}
                 <div className="flex items-center gap-2 border-l border-[#1e252e] pl-6">
                    <span className="text-[9px] font-bold tracking-widest text-[#4e5d74] mr-2">{lang === 'jp' ? 'サイドバー' : 'SIDEBAR'}</span>
                    <div className="flex bg-[#111418] border border-[#1e252e] rounded text-[9px] font-bold p-0.5 h-[28px]">
                      <button onClick={() => setSidebarPosition('left')} className={`px-4 h-full flex items-center justify-center rounded-sm transition-colors ${sidebarPosition === 'left' ? 'bg-[#2d3640] text-[#00ffff]' : 'text-[#8a95a3] hover:text-[#e2e8f0]'}`}>{lang === 'jp' ? '左' : 'LEFT'}</button>
                      <button onClick={() => setSidebarPosition('right')} className={`px-4 h-full flex items-center justify-center rounded-sm transition-colors ${sidebarPosition === 'right' ? 'bg-[#2d3640] text-[#00ffff]' : 'text-[#8a95a3] hover:text-[#e2e8f0]'}`}>{lang === 'jp' ? '右' : 'RIGHT'}</button>
                    </div>
                 </div>

                 {/* Theme Toggles */}
                 <div className="flex items-center gap-2 border-l border-[#1e252e] pl-6">
                    <button 
                      onClick={() => setThemeMode(prev => prev === 'dark' ? 'mono' : (prev === 'mono' ? 'red' : 'dark'))} 
                      className="flex items-center gap-2 px-3 h-[28px] bg-[#111418] border border-[#1e252e] rounded text-[9px] font-bold text-[#8a95a3] hover:text-[#e2e8f0] hover:bg-[#2d3640] transition-colors uppercase"
                    >
                      <Palette size={14} className="text-[#4e5d74]" />
                      <span>{lang === 'jp' ? 'テーマ:' : 'THEME:'} <span className="inline-block w-[36px] text-left text-[#00ffff] ml-1">{lang === 'jp' ? (themeMode === 'dark' ? 'ダーク' : themeMode === 'mono' ? 'モノ' : 'レッド') : themeMode}</span></span>
                    </button>
                 </div>

                 <div className="flex items-center gap-3 border-l border-[#1e252e] pl-6">
                    {/* Settings Button */}
                    <button 
                      className="p-1.5 text-[#8a95a3] hover:text-[#e2e8f0] bg-[#111418] hover:bg-[#2d3640] border border-[#1e252e] rounded-md transition-colors"
                      onClick={() => setIsGlobalSettingsOpen(prev => !prev)}
                      title="Global Settings"
                    >
                      <Settings size={16} />
                    </button>
                    
                    {/* Fullscreen Button */}
                    <button 
                      className="p-1.5 text-[#8a95a3] hover:text-[#e2e8f0] bg-[#111418] hover:bg-[#2d3640] border border-[#1e252e] rounded-md transition-colors"
                      onClick={() => {
                        if (!document.fullscreenElement) {
                          document.documentElement.requestFullscreen().catch(err => console.error(err));
                        } else {
                          document.exitFullscreen().catch(err => console.error(err));
                        }
                      }}
                      title="Toggle Fullscreen"
                    >
                      {isFullscreen ? <Shrink size={16} /> : <Maximize size={16} />}
                    </button>
                    
                    {/* Close Header Button */}
                    <button 
                      onClick={() => setIsHeaderOpen(false)}
                      className="p-1.5 text-[#8a95a3] hover:text-[#e2e8f0] bg-[#111418] hover:bg-[#2d3640] border border-[#1e252e] rounded-md transition-colors"
                      title="Close Header"
                    >
                      <ChevronUp size={16} />
                    </button>
                 </div>
              </div>
            </div>
            
            {/* Subtle bottom line indicator */}
            <div className="h-[2px] w-full bg-gradient-to-r from-transparent via-[#00ffff]/20 to-transparent absolute bottom-0 left-0" />
          </motion.div>
        )}
      </AnimatePresence>

      {!isHeaderOpen && (
        <div className="absolute top-4 right-6 z-[60]">
          <button 
            onClick={() => setIsHeaderOpen(true)}
            className="p-1.5 bg-white/90 text-gray-700 hover:text-gray-900 border border-gray-300 hover:bg-white rounded-md transition-colors shadow-sm backdrop-blur-sm"
            title="Open Header"
          >
            <ChevronDown size={16} />
          </button>
        </div>
      )}

      
        
        {/* Canvas Area */}
  
      <div 
        ref={containerRef} 
        className={`flex-1 flex flex-col items-center justify-center relative overflow-hidden group/canvasarea ${isPanning ? 'cursor-grabbing' : ''}`} 
        style={{ backgroundColor: canvasBgColor }}
        onClick={() => setSelectedBlockId(null)}
        onWheel={(e) => {
          const zoomSensitivity = 0.1;
          const zoomDelta = -e.deltaY * zoomSensitivity;
          setArtboardScaleParam(prev => Math.max(10, Math.min(300, prev + zoomDelta)));
        }}
        onPointerDown={(e) => {
          if (e.button === 2) { // Right click
            setIsPanning(true);
            e.currentTarget.setPointerCapture(e.pointerId);
          }
        }}
        onPointerMove={(e) => {
          if (isPanning) {
            setArtboardOffset(prev => ({
              x: prev.x + e.movementX,
              y: prev.y + e.movementY
            }));
          }
        }}
        onPointerUp={(e) => {
          if (isPanning && e.button === 2) {
            setIsPanning(false);
            e.currentTarget.releasePointerCapture(e.pointerId);
          }
        }}
        onContextMenu={(e) => e.preventDefault()}
         >
        {/* Sidebar Toggle Button */}
        <div 
          className={`absolute top-1/2 -translate-y-1/2 z-50 ${sidebarPosition === 'left' ? 'left-0' : 'right-0'}`}
        >
          <button 
            onClick={(e) => { e.stopPropagation(); setIsSidebarOpen(!isSidebarOpen); }}
            className={`group flex items-center justify-center bg-[#4e5d74] border border-[#2d3640] text-[#e2e8f0] hover:bg-[#a3b8cc] hover:text-[#0a1128] transition-all duration-300 shadow-lg h-16 overflow-hidden ${sidebarPosition === 'left' ? 'rounded-r-lg border-l-0' : 'rounded-l-lg border-r-0'}`}
            style={{ width: '8px', opacity: 0.6 }}
            onMouseEnter={(e) => { e.currentTarget.style.width = '24px'; e.currentTarget.style.opacity = '1'; }}
            onMouseLeave={(e) => { e.currentTarget.style.width = '8px'; e.currentTarget.style.opacity = '0.6'; }}
          >
            <div className={`opacity-0 group-hover:opacity-100 transition-opacity duration-200 delay-100`}>
              {sidebarPosition === 'left' ? (
                isSidebarOpen ? <ChevronLeft size={14}/> : <ChevronRight size={14}/>
              ) : (
                isSidebarOpen ? <ChevronRight size={14}/> : <ChevronLeft size={14}/>
              )}
            </div>
          </button>
        </div>

        {/* Subtle grid background */}
        <div className="absolute inset-0 pointer-events-none opacity-[0.04]" 
             style={{ backgroundImage: 'linear-gradient(#ffffff 1px, transparent 1px), linear-gradient(90deg, #ffffff 1px, transparent 1px)', backgroundSize: '64px 64px' }}>
        </div>

        {/* The Frame Container (Scales to fit) */}
        <div 
           className="relative group z-10"
           style={{
             width: '1200px',
             height: '900px',
             translate: `${artboardOffset.x}px ${artboardOffset.y}px`,
             scale: scale,
             transition: 'scale 0.05s ease-out',
             transformOrigin: 'center center',
             boxShadow: artboardShadow ? '0 40px 80px -20px rgba(0, 0, 0, 0.4), 0 0 0 1px rgba(0,0,0,0.05)' : 'none'
           }}
        >
           {/* The actual canvas to be exported */}
           <div ref={canvasRef} className="w-full h-full bg-white absolute inset-0 overflow-hidden" style={{ width: '1200px', height: '900px' }}>
             <PreviewCanvas 
               imageUrl={imageUrl} 
               image2Url={image2Url}
               kicker={kicker}
               heading={heading} 
               body={body} 
               body2={body2}
               meta1={meta1}
               meta2={meta2}
               orientation={orientation} 
               stylePattern={stylePattern} 
               gridMode={gridMode}
               isEditMode={isEditMode}
               blockStyles={blockStyles[`${stylePattern}-${orientation}`] || {}}
               selectedBlockId={selectedBlockId}
               onSelectBlock={handleSelectBlock}
               offsets={offsets[`${stylePattern}-${orientation}`] || {}}
               onDragEnd={handleDragEnd}
               isMonotone={isMonotone}
               themeMode={themeMode}
               canvasBgColor={canvasBgColor}
             />
           </div>

           {/* Export UI removed */}
        </div>
        
        <motion.div 
          layout
          drag
          dragMomentum={false}
          dragConstraints={panelConstraintsRef}
          className={`ignore-theme absolute w-[280px] font-mono tracking-widest border rounded-lg z-[100] flex-col transition-colors duration-300 backdrop-blur-md cursor-grab active:cursor-grabbing flex overflow-hidden ${
            statusTheme === 'dark' 
              ? 'bg-[#080a0d]/80 border-white/10 text-[#ffffff] shadow-black/50 shadow-2xl' 
              : 'bg-white/90 border-black/10 text-[#000000] shadow-black/20 shadow-2xl'
          }`}
          style={{ 
            opacity: showStatusText ? statusOpacity / 100 : 0, 
            pointerEvents: showStatusText ? 'auto' : 'none',
            top: '30px',
            left: '30px'
          }}
        >
          <div 
            onDoubleClick={() => setIsPanelCollapsed(!isPanelCollapsed)}
            className={`flex justify-between items-center text-[8px] px-4 py-3 cursor-pointer select-none ${isPanelCollapsed ? '' : 'border-b'} ${statusTheme === 'dark' ? 'border-white/10 text-white/60' : 'border-gray-200 text-gray-500'}`}
          >
            <span className="uppercase font-bold">Information Panel</span>
            <span>SCALE: {Math.round(artboardScaleParam)}%</span>
          </div>
          <AnimatePresence>
            {!isPanelCollapsed && (
              <motion.div 
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.3, ease: 'easeInOut' }}
                className="overflow-hidden"
              >
                <div className={`text-[10px] flex flex-col gap-1.5 px-4 pb-3 pt-2 ${statusTheme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                  <div className="flex justify-between">
                    <span className={statusTheme === 'dark' ? 'text-gray-500' : 'text-gray-400'}>MODE:</span> 
                    <span className={!isEditMode ? (statusTheme === 'dark' ? 'text-cyan-400' : 'text-blue-600') : (statusTheme === 'dark' ? 'text-[#ffffff]' : 'text-[#000000]')}>{!isEditMode ? 'PREVIEW' : 'DESIGN'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className={statusTheme === 'dark' ? 'text-gray-500' : 'text-gray-400'}>GRID:</span> 
                    <span className={statusTheme === 'dark' ? 'text-[#ffffff]' : 'text-[#000000]'}>{stylePattern ? stylePattern.toUpperCase() : 'BLANK'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className={statusTheme === 'dark' ? 'text-gray-500' : 'text-gray-400'}>FORMAT:</span> 
                    <span className={statusTheme === 'dark' ? 'text-[#ffffff]' : 'text-[#000000]'}>{orientation.toUpperCase()}</span>
                  </div>
                  <div className="flex justify-between mb-1">
                    <span className={statusTheme === 'dark' ? 'text-gray-500' : 'text-gray-400'}>TARGET:</span> 
                    <span className={selectedBlockId ? (statusTheme === 'dark' ? 'text-cyan-400' : 'text-blue-600') : (statusTheme === 'dark' ? 'text-gray-500' : 'text-gray-400')}>{selectedBlockId ? selectedBlockId.toUpperCase() : 'NONE'}</span>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>

      {resetConfirmTarget && (
        <div className="absolute inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm">
          <div className="bg-[#0a0c10] border border-[#1e252e] p-6 rounded-lg w-[320px] shadow-2xl">
            <h3 className="text-white text-sm font-bold tracking-widest mb-4">{lang === 'jp' ? '確認' : 'CONFIRM'}</h3>
            <p className="text-[#8a95a3] text-xs mb-6">
              {lang === 'jp' 
                ? (resetConfirmTarget === 'all' 
                    ? '本当にすべてリセットしますか？この操作は取り消せません。' 
                    : 'この配置設定をリセットしますか？この操作は取り消せません。')
                : (resetConfirmTarget === 'all'
                    ? 'Are you sure you want to reset all? This action cannot be undone.'
                    : 'Are you sure you want to reset this layout? This action cannot be undone.')
              }
            </p>
            <div className="flex gap-3">
              <button onClick={() => setResetConfirmTarget(null)} className="flex-1 py-2 text-[10px] font-bold border border-[#1e252e] text-[#8a95a3] hover:text-[#e2e8f0] hover:border-[#4e5d74] rounded transition-colors">{lang === 'jp' ? 'キャンセル' : 'CANCEL'}</button>
              <button onClick={() => {
                if (resetConfirmTarget === 'all') {
                  setOffsets({});
                  setImageUrl('');
                  setImage2Url('');
                  setHeading(DEFAULT_HEADING);
                  setBody(DEFAULT_BODY);
                  setBody2('');
                  setKicker(DEFAULT_KICKER);
                  setMeta1(DEFAULT_META1);
                  setMeta2(DEFAULT_META2);
                  setGridMode('none');
                  setBlockStyles({});
                  setSelectedBlockId(null);
                  setStylePattern('story');
                  setOrientation('vertical');
                  setIsMonotone(false);
                } else {
                  setOffsets(prev => ({...prev, [`${resetConfirmTarget}-${orientation}`]: {}}));
                  setBlockStyles(prev => ({...prev, [`${resetConfirmTarget}-${orientation}`]: {}}));
                }
                setResetConfirmTarget(null);
              }} className="flex-1 py-2 text-[10px] font-bold bg-[#d94a38] hover:bg-[#ff5544] text-white rounded transition-colors">{lang === 'jp' ? 'リセット' : 'RESET'}</button>
            </div>
          </div>
        </div>
      )}
      {/* Bottom info text removed, let's keep only necessary parts */}
      </div>
    </div>
  );
}

