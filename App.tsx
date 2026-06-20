/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useRef, useCallback, useEffect } from 'react';
import { motion, AnimatePresence, LayoutGroup } from 'motion/react';
import { toPng } from 'html-to-image';
import { 
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
  Settings
} from 'lucide-react';

type Orientation = 'horizontal' | 'vertical';
type LayoutStyle = 'impact' | 'story' | 'gallery' | 'split' | 'magazine' | 'blank';

const DEFAULT_IMAGE = "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80";

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

  // Determine z-index based on state and style
  const currentZIndex = isSelected ? 9999 : style.zIndex;

  return (
    <motion.div
        id={id}
        onClick={onClick}
        className={`${className} ${isEdit ? 'ring-1 cursor-move' : ''} ${isSelected ? 'ring-2 ring-red-500 shadow-[0_0_15px_rgba(239,68,68,0.5)]' : ''}`}
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
            '--tw-ring-color': isSelected ? 'rgb(239, 68, 68)' : gridColor
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
    c.bgWrapper = "absolute inset-0 z-0 bg-black";
    c.bgWrapper2 = "absolute z-0 " + (isV ? "w-[400px] h-[300px] bottom-[100px] right-[100px]" : "w-[300px] h-[400px] left-[100px] bottom-[100px]");
    c.image += " opacity-60 scale-105";
    c.image2 += " opacity-80 drop-shadow-2xl";
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
    c.accent2 += " bg-black/5 " + (isV ? "w-[1px] h-[900px] left-[500px]" : "w-[1200px] h-[1px] top-[600px]");
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
    c.kicker += " text-white absolute z-20 bg-black px-4 py-2 " + (isV ? "top-[80px] left-[520px]" : "top-[680px] left-[720px]");
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
    c.image += " opacity-80 brightness-110";
    c.image2 += " opacity-50 grayscale blend-multiply";
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
  gridMode: 'none' | 'cyan' | 'dark';
  isEditMode: boolean;
  offsets: Record<string, {x: number, y: number}>;
  onDragEnd: (id: string, dx: number, dy: number) => void;
  showGrid?: boolean;
  blockStyles: Record<string, { [key: string]: any }>;
  selectedBlockId: string | null;
  onSelectBlock: (id: string) => void;
  isMonotone: boolean;
}

const PreviewCanvas = ({ 
  imageUrl, image2Url, kicker, heading, body, body2, meta1, meta2, orientation, stylePattern, gridMode, isEditMode, offsets, onDragEnd, blockStyles, selectedBlockId, onSelectBlock, isMonotone 
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

  return (
    <>
      <motion.div className={c.container} style={base} transition={spring}>
        
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
            zIndex: blockStyles['bgWrapper']?.zIndex !== undefined ? blockStyles['bgWrapper'].zIndex : undefined,
            borderWidth: blockStyles['bgWrapper']?.borderWidth !== undefined ? `${blockStyles['bgWrapper']?.borderWidth}px` : undefined,
            borderStyle: blockStyles['bgWrapper']?.borderWidth !== undefined ? 'solid' : undefined,
            borderColor: blockStyles['bgWrapper']?.borderColor || 'white'
          }}
        >
          <motion.img 
            src={imageUrl || DEFAULT_IMAGE} 
            className={c.image} 
            transition={spring} 
            draggable={false}
            style={{ 
              filter: isMonotone ? 'grayscale(100%)' : 'none',
              opacity: blockStyles['bgWrapper']?.opacity !== undefined ? blockStyles['bgWrapper'].opacity / 100 : undefined
            }}
          />
        </DraggableBlock>

        {(gridMode !== 'none' || isEditMode) && (() => {
          const gridColor = gridMode === 'cyan' ? '#00ffff' : (gridMode === 'dark' ? '#333333' : '#e2e8f0');
          return (
            <div className="absolute inset-0 z-50 pointer-events-none opacity-60">
              {isEditMode && (
                <div className="absolute top-4 left-4 bg-black px-3 py-1.5 text-[10px] font-bold tracking-widest z-50 flex items-center gap-2 border" style={{ color: gridColor, borderColor: gridColor }}>
                  <span className="w-2 h-2 rounded-full animate-pulse" style={{ backgroundColor: gridColor }}></span>
                  DESIGN MODE ACTIVE
                </div>
              )}
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

        {(image2Url || isEditMode) && (
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
              zIndex: blockStyles['bgWrapper2']?.zIndex !== undefined ? blockStyles['bgWrapper2'].zIndex : undefined,
              borderWidth: blockStyles['bgWrapper2']?.borderWidth !== undefined ? `${blockStyles['bgWrapper2']?.borderWidth}px` : undefined,
              borderStyle: blockStyles['bgWrapper2']?.borderWidth !== undefined ? 'solid' : undefined,
              borderColor: blockStyles['bgWrapper2']?.borderColor || 'white'
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
                  opacity: blockStyles['bgWrapper2']?.opacity !== undefined ? blockStyles['bgWrapper2'].opacity / 100 : undefined
                }}
              />
            ) : (
              <div className="w-full h-full border border-dashed border-[#00ffff]/50 flex items-center justify-center bg-[#00ffff]/10 min-w-[100px] min-h-[100px]">
                <span className="text-[#00ffff] text-[10px] font-bold font-mono">IMAGE 2 AREA</span>
              </div>
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
            style={{ 
              pointerEvents: isEditMode ? 'auto' : 'none', 
              backgroundColor: blockStyles['accent1']?.color || undefined, borderColor: blockStyles['accent1']?.color || undefined, color: blockStyles['accent1']?.color || undefined, 
              zIndex: blockStyles['accent1']?.zIndex !== undefined ? blockStyles['accent1'].zIndex : undefined,
              display: (blockStyles['accent1']?.color || isEditMode) ? 'block' : undefined
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
            style={{ 
              pointerEvents: isEditMode ? 'auto' : 'none', 
              backgroundColor: blockStyles['accent2']?.color || undefined, borderColor: blockStyles['accent2']?.color || undefined, color: blockStyles['accent2']?.color || undefined, 
              zIndex: blockStyles['accent2']?.zIndex !== undefined ? blockStyles['accent2'].zIndex : undefined,
              display: (blockStyles['accent2']?.color || isEditMode) ? 'block' : undefined
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
              pointerEvents: isEditMode ? 'auto' : 'none', color: blockStyles['kicker']?.color || undefined, fontFamily: blockStyles['kicker']?.fontFamily || undefined, letterSpacing: blockStyles['kicker']?.letterSpacing !== undefined ? `${blockStyles['kicker']?.letterSpacing}em` : undefined, lineHeight: blockStyles['kicker']?.lineHeight !== undefined ? blockStyles['kicker']?.lineHeight : undefined, zIndex: blockStyles['kicker']?.zIndex !== undefined ? blockStyles['kicker'].zIndex : undefined,
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
              pointerEvents: isEditMode ? 'auto' : 'none', color: blockStyles['titleContainer']?.color || undefined, fontFamily: blockStyles['titleContainer']?.fontFamily || undefined, letterSpacing: blockStyles['titleContainer']?.letterSpacing !== undefined ? `${blockStyles['titleContainer']?.letterSpacing}em` : undefined, lineHeight: blockStyles['titleContainer']?.lineHeight !== undefined ? blockStyles['titleContainer']?.lineHeight : undefined, zIndex: blockStyles['titleContainer']?.zIndex !== undefined ? blockStyles['titleContainer'].zIndex : undefined,
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
              pointerEvents: isEditMode ? 'auto' : 'none', color: blockStyles['bodyContainer']?.color || undefined, fontFamily: blockStyles['bodyContainer']?.fontFamily || undefined, letterSpacing: blockStyles['bodyContainer']?.letterSpacing !== undefined ? `${blockStyles['bodyContainer']?.letterSpacing}em` : undefined, lineHeight: blockStyles['bodyContainer']?.lineHeight !== undefined ? blockStyles['bodyContainer']?.lineHeight : undefined, zIndex: blockStyles['bodyContainer']?.zIndex !== undefined ? blockStyles['bodyContainer'].zIndex : undefined,
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
                pointerEvents: isEditMode ? 'auto' : 'none', color: blockStyles['body2Container']?.color || undefined, fontFamily: blockStyles['body2Container']?.fontFamily || undefined, letterSpacing: blockStyles['body2Container']?.letterSpacing !== undefined ? `${blockStyles['body2Container']?.letterSpacing}em` : undefined, lineHeight: blockStyles['body2Container']?.lineHeight !== undefined ? blockStyles['body2Container']?.lineHeight : undefined, zIndex: blockStyles['body2Container']?.zIndex !== undefined ? blockStyles['body2Container'].zIndex : undefined,
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
                <div className="w-full h-full border border-dashed border-[#00ffff]/50 flex items-center justify-center bg-[#00ffff]/10 min-w-[100px] min-h-[50px]">
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
              pointerEvents: isEditMode ? 'auto' : 'none', color: blockStyles['meta1']?.color || undefined, fontFamily: blockStyles['meta1']?.fontFamily || undefined, letterSpacing: blockStyles['meta1']?.letterSpacing !== undefined ? `${blockStyles['meta1']?.letterSpacing}em` : undefined, lineHeight: blockStyles['meta1']?.lineHeight !== undefined ? blockStyles['meta1']?.lineHeight : undefined, zIndex: blockStyles['meta1']?.zIndex !== undefined ? blockStyles['meta1'].zIndex : undefined,
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
              pointerEvents: isEditMode ? 'auto' : 'none', color: blockStyles['meta2']?.color || undefined, fontFamily: blockStyles['meta2']?.fontFamily || undefined, letterSpacing: blockStyles['meta2']?.letterSpacing !== undefined ? `${blockStyles['meta2']?.letterSpacing}em` : undefined, lineHeight: blockStyles['meta2']?.lineHeight !== undefined ? blockStyles['meta2']?.lineHeight : undefined, zIndex: blockStyles['meta2']?.zIndex !== undefined ? blockStyles['meta2'].zIndex : undefined,
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
    </>
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
  const [themeMode, setThemeMode] = useState<'dark'|'light'>('dark');
  const [isGlobalSettingsOpen, setIsGlobalSettingsOpen] = useState<boolean>(false);
  const [artboardShadow, setArtboardShadow] = useState<boolean>(true);
  const [artboardScaleParam, setArtboardScaleParam] = useState<number>(92);
  const [showStatusText, setShowStatusText] = useState<boolean>(true);
  const [statusOpacity, setStatusOpacity] = useState<number>(80);
  const [statusTheme, setStatusTheme] = useState<'dark'|'light'>('dark');
  const [isPanelCollapsed, setIsPanelCollapsed] = useState<boolean>(false);
  const [lang, setLang] = useState<'en'|'jp'>('en');

  useEffect(() => {
    const filled: number[] = [];
    [1, 2, 3, 4].forEach(slot => {
      if (localStorage.getItem(`solid-design-slot-${slot}`)) filled.push(slot);
    });
    setFilledSlots(filled);
  }, []);
  
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
      isMonotone
    };
    localStorage.setItem('solid-design-state', JSON.stringify(state));
  }, [imageUrl, image2Url, kicker, heading, body, body2, meta1, meta2, orientation, stylePattern, offsets, blockStyles, isMonotone]);

  const handleManualSave = () => {
    setIsSaving(true);
    const data = { imageUrl, image2Url, kicker, heading, body, body2, meta1, meta2, orientation, stylePattern, gridMode, isMonotone, blockStyles, offsets };
    localStorage.setItem(`solid-design-slot-1`, JSON.stringify(data));
    setFilledSlots(prev => prev.includes(1) ? prev : [...prev, 1]);
    setTimeout(() => setIsSaving(false), 300);
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
          link.download = `editorial-${stylePattern}-${orientation}.png`;
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
            <div className="w-full">
              <div className="text-[8px] font-bold tracking-widest opacity-60 mb-1">COLOR</div>
              <div className="flex gap-1 overflow-x-auto" style={{ filter: themeMode === 'light' ? 'invert(1) hue-rotate(180deg)' : 'none' }}>
                 {[
                   { id: '', label: 'AUTO' },
                   { id: '#ffffff', label: 'W' },
                   { id: '#000000', label: 'B' },
                   { id: '#d94a38', label: 'R' },
                   { id: '#00ffff', label: 'C' }
                 ].map(c => {
                   const isActive = (blockStyles[`${stylePattern}-${orientation}`]?.[blockId]?.color || '') === c.id;
                   return (
                     <button 
                       key={c.id}
                       className={`flex-1 min-w-[20px] py-1 text-[9px] font-bold rounded transition-all ${isActive ? 'bg-[#2d3640] text-white shadow-sm' : 'text-[#8a95a3] hover:text-[#e2e8f0] bg-black border border-[#1e252e]'}`}
                       onClick={(e) => { e.stopPropagation(); handleBlockStyleChange('color', c.id, blockId); }}
                     >
                       {c.label}
                     </button>
                   );
                 })}
                 <label className="flex-1 min-w-[20px] relative py-1 flex items-center justify-center rounded transition-all cursor-pointer border border-[#1e252e] hover:border-[#4d5e7a] bg-black">
                   <span className="text-[9px] font-bold text-[#8a95a3]">+</span>
                   <input 
                     type="color" 
                     className="absolute inset-0 opacity-0 w-full h-full cursor-pointer"
                     value={blockStyles[`${stylePattern}-${orientation}`]?.[blockId]?.color || '#ffffff'}
                     onChange={(e) => { e.stopPropagation(); handleBlockStyleChange('color', e.target.value, blockId); }}
                   />
                 </label>
              </div>
            </div>
            <div className="w-full">
              <div className="text-[8px] font-bold tracking-widest opacity-60 mb-1">FONT</div>
              <div className="relative border border-[#1e252e] rounded bg-black hover:border-[#4d5e7a] transition-all">
                <select 
                  className="w-full bg-transparent text-white p-1 pr-6 appearance-none text-[9px] outline-none cursor-pointer"
                  value={blockStyles[`${stylePattern}-${orientation}`]?.[blockId]?.fontFamily || ''}
                  onChange={(e) => { e.stopPropagation(); handleBlockStyleChange('fontFamily', e.target.value, blockId); }}
                  style={{ fontFamily: blockStyles[`${stylePattern}-${orientation}`]?.[blockId]?.fontFamily || 'inherit' }}
                >
                   <option value="" style={{fontFamily: 'inherit', color: 'white', backgroundColor: 'black'}}>AUTO</option>
                   <option value='Meiryo, sans-serif' style={{fontFamily: 'Meiryo, sans-serif', color: 'white', backgroundColor: 'black'}}>MEIRYO &nbsp; (メイリオ)</option>
                   <option value='"Yu Gothic", "YuGothic", "Hiragino Kaku Gothic ProN", "Hiragino Sans", sans-serif' style={{fontFamily: '"Yu Gothic", "YuGothic", "Hiragino Kaku Gothic ProN", "Hiragino Sans", sans-serif', color: 'white', backgroundColor: 'black'}}>STANDARD GOTHIC &nbsp; (ゴシック体)</option>
                   <option value='"M PLUS Rounded 1c", sans-serif' style={{fontFamily: '"M PLUS Rounded 1c", sans-serif', color: 'white', backgroundColor: 'black'}}>ROUNDED GOTHIC &nbsp; (丸ゴシック)</option>
                   <option value='"Zen Maru Gothic", sans-serif' style={{fontFamily: '"Zen Maru Gothic", sans-serif', color: 'white', backgroundColor: 'black'}}>ZEN MARU GOTHIC</option>
                   <option value='"Dela Gothic One", sans-serif' style={{fontFamily: '"Dela Gothic One", sans-serif', color: 'white', backgroundColor: 'black'}}>DELA GOTHIC</option>
                   <option value='"Train One", sans-serif' style={{fontFamily: '"Train One", sans-serif', color: 'white', backgroundColor: 'black'}}>TRAIN ONE</option>
                   <option value='"Reggae One", sans-serif' style={{fontFamily: '"Reggae One", sans-serif', color: 'white', backgroundColor: 'black'}}>REGGAE ONE</option>
                   <option value='"DotGothic16", sans-serif' style={{fontFamily: '"DotGothic16", sans-serif', color: 'white', backgroundColor: 'black'}}>DOT GOTHIC</option>
                   <option value='"M PLUS 1p", sans-serif' style={{fontFamily: '"M PLUS 1p", sans-serif', color: 'white', backgroundColor: 'black'}}>M PLUS 1P</option>
                   <option value='"Noto Sans JP", sans-serif' style={{fontFamily: '"Noto Sans JP", sans-serif', color: 'white', backgroundColor: 'black'}}>NOTO SANS</option>
                   <option value='"Noto Serif JP", serif' style={{fontFamily: '"Noto Serif JP", serif', color: 'white', backgroundColor: 'black'}}>NOTO SERIF</option>
                   <option value='"Shippori Mincho", serif' style={{fontFamily: '"Shippori Mincho", serif', color: 'white', backgroundColor: 'black'}}>SHIPPORI</option>
                   <option value='"Zen Dots", sans-serif' style={{fontFamily: '"Zen Dots", sans-serif', color: 'white', backgroundColor: 'black'}}>ZEN DOTS</option>
                </select>
                <div className="absolute inset-y-0 right-1 flex items-center pointer-events-none text-[#8a95a3]">
                  <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                </div>
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
                       className={`flex-1 py-1 text-[9px] font-bold rounded transition-all ${isActive ? 'bg-[#00ffff] text-black shadow-sm' : 'bg-black text-[#8a95a3] hover:text-[#e2e8f0] border border-[#1e252e]'}`}
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
            <div className="flex-1">
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
            ) : <div className="flex-1 border-l border-[#1e252e] pl-2"></div>}
          </div>

          {isImageBlock && (
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
                 <div className="text-[8px] font-bold tracking-widest opacity-60 mb-1">BORDER COLOR</div>
                 <div className="flex gap-1 h-[21px]" style={{ filter: themeMode === 'light' ? 'invert(1) hue-rotate(180deg)' : 'none' }}>
                   <label className="flex-1 relative flex items-center justify-center bg-black border border-[#1e252e] rounded overflow-hidden cursor-pointer hover:border-[#4e5d74]">
                     <div className="w-full h-full" style={{ backgroundColor: blockStyles[`${stylePattern}-${orientation}`]?.[blockId]?.borderColor || '#ffffff' }} />
                     <input 
                       type="color" 
                       className="absolute inset-0 opacity-0 w-full h-full cursor-pointer"
                       value={blockStyles[`${stylePattern}-${orientation}`]?.[blockId]?.borderColor || '#ffffff'}
                       onChange={(e) => { e.stopPropagation(); handleBlockStyleChange('borderColor', e.target.value, blockId); }}
                     />
                   </label>
                 </div>
              </div>
            </div>
          )}

          {['kicker', 'titleContainer', 'bodyContainer', 'body2Container', 'meta1', 'meta2'].includes(blockId) && (
            <>
              <div className="flex gap-2 pt-2 border-t border-[#1e252e]">
                <div className="flex-1">
                  <div className="text-[8px] font-bold tracking-widest opacity-60 mb-1">TEXT DIRECTION</div>
                  <div className="flex gap-1">
                    <button 
                       className={`flex-1 py-1 text-[9px] font-bold rounded transition-all ${(blockStyles[`${stylePattern}-${orientation}`]?.[blockId]?.writingMode || '') === '' ? 'bg-[#00ffff] text-black shadow-sm' : 'bg-black text-[#8a95a3] hover:text-[#e2e8f0] border border-[#1e252e]'}`}
                       onClick={(e) => { e.stopPropagation(); handleBlockStyleChange('writingMode', '', blockId); }}
                    >AUTO</button>
                    <button 
                       className={`flex-1 py-1 text-[9px] font-bold rounded transition-all ${(blockStyles[`${stylePattern}-${orientation}`]?.[blockId]?.writingMode || '') === 'horizontal-tb' ? 'bg-[#00ffff] text-black shadow-sm' : 'bg-black text-[#8a95a3] hover:text-[#e2e8f0] border border-[#1e252e]'}`}
                       onClick={(e) => { e.stopPropagation(); handleBlockStyleChange('writingMode', 'horizontal-tb', blockId); }}
                    >HORZ</button>
                    <button 
                       className={`flex-1 py-1 text-[9px] font-bold rounded transition-all ${(blockStyles[`${stylePattern}-${orientation}`]?.[blockId]?.writingMode || '') === 'vertical-rl' ? 'bg-[#00ffff] text-black shadow-sm' : 'bg-black text-[#8a95a3] hover:text-[#e2e8f0] border border-[#1e252e]'}`}
                       onClick={(e) => { e.stopPropagation(); handleBlockStyleChange('writingMode', 'vertical-rl', blockId); }}
                    >VERT</button>
                  </div>
                </div>
                <div className="flex-1 border-l border-[#1e252e] pl-2">
                  <div className="text-[8px] font-bold tracking-widest opacity-60 mb-1">ALIGNMENT</div>
                  <div className="flex gap-1">
                    <button 
                      className={`flex-1 py-1 text-[9px] font-bold rounded transition-all ${(blockStyles[`${stylePattern}-${orientation}`]?.[blockId]?.textAlign || '') === '' ? 'bg-[#00ffff] text-black shadow-sm' : 'bg-black text-[#8a95a3] hover:text-[#e2e8f0] border border-[#1e252e]'}`}
                      onClick={(e) => { e.stopPropagation(); handleBlockStyleChange('textAlign', '', blockId); }}
                    >AUTO</button>
                    <button 
                      className={`flex-1 py-1 text-[9px] font-bold rounded transition-all ${(blockStyles[`${stylePattern}-${orientation}`]?.[blockId]?.textAlign || '') === 'left' ? 'bg-[#00ffff] text-black shadow-sm' : 'bg-black text-[#8a95a3] hover:text-[#e2e8f0] border border-[#1e252e]'}`}
                      onClick={(e) => { e.stopPropagation(); handleBlockStyleChange('textAlign', 'left', blockId); }}
                    >L</button>
                    <button 
                      className={`flex-1 py-1 text-[9px] font-bold rounded transition-all ${(blockStyles[`${stylePattern}-${orientation}`]?.[blockId]?.textAlign || '') === 'center' ? 'bg-[#00ffff] text-black shadow-sm' : 'bg-black text-[#8a95a3] hover:text-[#e2e8f0] border border-[#1e252e]'}`}
                      onClick={(e) => { e.stopPropagation(); handleBlockStyleChange('textAlign', 'center', blockId); }}
                    >C</button>
                    <button 
                      className={`flex-1 py-1 text-[9px] font-bold rounded transition-all ${(blockStyles[`${stylePattern}-${orientation}`]?.[blockId]?.textAlign || '') === 'right' ? 'bg-[#00ffff] text-black shadow-sm' : 'bg-black text-[#8a95a3] hover:text-[#e2e8f0] border border-[#1e252e]'}`}
                      onClick={(e) => { e.stopPropagation(); handleBlockStyleChange('textAlign', 'right', blockId); }}
                    >R</button>
                    <button 
                      className={`flex-1 py-1 text-[9px] font-bold rounded transition-all ${(blockStyles[`${stylePattern}-${orientation}`]?.[blockId]?.textAlign || '') === 'justify' ? 'bg-[#00ffff] text-black shadow-sm' : 'bg-black text-[#8a95a3] hover:text-[#e2e8f0] border border-[#1e252e]'}`}
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
                       className={`flex-[1.5] py-1 text-[9px] font-bold rounded transition-all ${(blockStyles[`${stylePattern}-${orientation}`]?.[blockId]?.textStroke || '') === '' ? 'bg-[#00ffff] text-black shadow-sm' : 'bg-black text-[#8a95a3] hover:text-[#e2e8f0] border border-[#1e252e]'}`}
                       onClick={(e) => { e.stopPropagation(); handleBlockStyleChange('textStroke', '', blockId); }}
                    >NONE</button>
                    <button 
                       className={`flex-1 py-1 text-[9px] font-bold rounded transition-all ${(blockStyles[`${stylePattern}-${orientation}`]?.[blockId]?.textStroke || '') === 'white' ? 'bg-[#00ffff] text-black shadow-sm' : 'bg-black text-[#8a95a3] hover:text-[#e2e8f0] border border-[#1e252e]'}`}
                       onClick={(e) => { e.stopPropagation(); handleBlockStyleChange('textStroke', 'white', blockId); }}
                    >WHT</button>
                    <button 
                       className={`flex-1 py-1 text-[9px] font-bold rounded transition-all ${(blockStyles[`${stylePattern}-${orientation}`]?.[blockId]?.textStroke || '') === 'black' ? 'bg-[#00ffff] text-black shadow-sm' : 'bg-black text-[#8a95a3] hover:text-[#e2e8f0] border border-[#1e252e]'}`}
                       onClick={(e) => { e.stopPropagation(); handleBlockStyleChange('textStroke', 'black', blockId); }}
                    >BLK</button>
                    <label className={`flex-1 py-1 min-w-[20px] text-[9px] font-bold rounded transition-all cursor-pointer flex items-center justify-center relative ${(blockStyles[`${stylePattern}-${orientation}`]?.[blockId]?.textStroke && blockStyles[`${stylePattern}-${orientation}`]?.[blockId]?.textStroke !== 'white' && blockStyles[`${stylePattern}-${orientation}`]?.[blockId]?.textStroke !== 'black') ? 'bg-[#00ffff] text-black shadow-sm' : 'bg-black text-[#8a95a3] hover:text-[#e2e8f0] border border-[#1e252e]'}`}>
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
                         className={`flex-[1.5] py-1 text-[9px] font-bold rounded transition-all ${(blockStyles[`${stylePattern}-${orientation}`]?.[blockId]?.dropShadow || '') === '' ? 'bg-[#00ffff] text-black shadow-sm' : 'bg-black text-[#8a95a3] hover:text-[#e2e8f0] border border-[#1e252e]'}`}
                         onClick={(e) => { e.stopPropagation(); handleBlockStyleChange('dropShadow', '', blockId); }}
                      >NONE</button>
                      <button 
                         className={`flex-1 py-1 text-[9px] font-bold rounded transition-all ${(blockStyles[`${stylePattern}-${orientation}`]?.[blockId]?.dropShadow || '') === 'rgba(255,255,255,0.7)' ? 'bg-[#00ffff] text-black shadow-sm' : 'bg-black text-[#8a95a3] hover:text-[#e2e8f0] border border-[#1e252e]'}`}
                         onClick={(e) => { e.stopPropagation(); handleBlockStyleChange('dropShadow', 'rgba(255,255,255,0.7)', blockId); }}
                      >WHT</button>
                      <button 
                         className={`flex-1 py-1 text-[9px] font-bold rounded transition-all ${(blockStyles[`${stylePattern}-${orientation}`]?.[blockId]?.dropShadow || '') === 'rgba(0,0,0,0.7)' ? 'bg-[#00ffff] text-black shadow-sm' : 'bg-black text-[#8a95a3] hover:text-[#e2e8f0] border border-[#1e252e]'}`}
                         onClick={(e) => { e.stopPropagation(); handleBlockStyleChange('dropShadow', 'rgba(0,0,0,0.7)', blockId); }}
                      >BLK</button>
                      <label className={`flex-1 py-1 min-w-[20px] text-[9px] font-bold rounded transition-all cursor-pointer flex items-center justify-center relative ${(blockStyles[`${stylePattern}-${orientation}`]?.[blockId]?.dropShadow && blockStyles[`${stylePattern}-${orientation}`]?.[blockId]?.dropShadow !== 'rgba(255,255,255,0.7)' && blockStyles[`${stylePattern}-${orientation}`]?.[blockId]?.dropShadow !== 'rgba(0,0,0,0.7)') ? 'bg-[#00ffff] text-black shadow-sm' : 'bg-black text-[#8a95a3] hover:text-[#e2e8f0] border border-[#1e252e]'}`}>
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
                         className={`flex-1 py-1 text-[9px] font-bold rounded transition-all flex items-center justify-center min-w-[32px] ${isActive ? 'bg-[#00ffff] text-black shadow-sm' : 'bg-black text-[#8a95a3] hover:text-[#e2e8f0] border border-[#1e252e]'}`}
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
    <div className={`w-full h-screen flex flex-col ${sidebarPosition === 'right' ? 'md:flex-row-reverse' : 'md:flex-row'} bg-[#080a0d] text-[#8a95a3] font-sans overflow-hidden`}>

      {/* Editor Sidebar */}
      <div 
        className={`h-full flex flex-col bg-[#111418] z-20 shrink-0 transition-all duration-300 ease-in-out relative ${sidebarPosition === 'right' ? 'border-l border-[#1e252e]' : 'border-r border-[#1e252e]'}`}
        style={{ 
          width: isSidebarOpen ? '320px' : '0px', 
          overflow: 'hidden',
          filter: themeMode === 'light' ? 'invert(1) hue-rotate(180deg)' : 'none'
        }}
      >
        <div className="w-[320px] h-full flex flex-col shrink-0 relative">
          <div className="p-6 pb-5 border-b border-[#1e252e] shrink-0 bg-[#0a0c10] flex flex-col justify-between min-h-[160px]">
            <div className="flex items-start justify-between w-full">
              <div className="flex items-start gap-4">
                <LayoutTemplate size={24} className="text-[#e2e8f0] mt-1 shrink-0" />
                <div className="flex flex-col gap-1">
                  <h1 className="text-white font-bold tracking-[0.05em] text-[22px] leading-tight" style={{ fontFamily: '"Share Tech Mono", monospace' }}>
                    SOLID DESIGN<br />EDITORIALIZER
                  </h1>
                </div>
              </div>
              
              <div className="shrink-0 mt-1 flex gap-2">
                <button 
                  className="p-1.5 text-[#8a95a3] hover:text-[#e2e8f0] bg-[#111418] hover:bg-[#2d3640] border border-[#2d3640] rounded-md transition-colors"
                  onClick={() => setIsGlobalSettingsOpen(true)}
                  title="Global Settings"
                >
                  <Settings size={14} />
                </button>
              </div>
            </div>
            
            <div className="flex items-end justify-between w-full mt-4">
              <p className="text-[9px] text-[#4e5d74] tracking-[0.1em] font-bold" style={{ fontFamily: '"Share Tech Mono", monospace' }}>ALGORITHMIC FORMATTING STUDIO</p>
              
              <div className="flex bg-[#111418] border border-[#2d3640] rounded-md overflow-hidden text-[9px] font-bold">
                <button 
                  onClick={() => setLang('en')}
                  className={`px-2 py-1 ${lang === 'en' ? 'bg-[#2d3640] text-[#00ffff]' : 'text-[#8a95a3] hover:text-[#e2e8f0]'}`}
                >
                  EN
                </button>
                <button 
                  onClick={() => setLang('jp')}
                  className={`px-2 py-1 ${lang === 'jp' ? 'bg-[#2d3640] text-[#00ffff]' : 'text-[#8a95a3] hover:text-[#e2e8f0]'}`}
                >
                  JP
                </button>
              </div>
            </div>
          </div>

          <div className="flex border-b border-[#1e252e] bg-[#080a0d] px-5 py-3 shrink-0">
            <div className="flex items-center gap-1 bg-[#111418] border border-[#1e252e] rounded p-1 w-full">
              <button 
                className={`flex-1 py-1.5 text-[10px] font-bold tracking-widest rounded transition-all ${orientation === 'horizontal' ? 'bg-[#2d3640] text-[#00ffff] shadow-sm' : 'text-[#8a95a3] hover:text-[#e2e8f0]'}`}
                onClick={() => setOrientation('horizontal')}
                title="横組レギュラー"
              >
                ☰ REGULAR
              </button>
              <button 
                className={`flex-1 py-1.5 text-[10px] font-bold tracking-widest rounded transition-all ${orientation === 'vertical' ? 'bg-[#2d3640] text-[#00ffff] shadow-sm' : 'text-[#8a95a3] hover:text-[#e2e8f0]'}`}
                onClick={() => setOrientation('vertical')}
                title="縦組エモーショナル"
              >
                Ⅲ EMOTIONAL
              </button>
            </div>
          </div>

          <div className="flex border-b border-[#1e252e] bg-[#0a0c10]">
          <button 
            className={`flex-1 py-3 text-[10px] font-bold tracking-widest transition-all ${activeTab === 'design' ? 'text-white border-b-2 border-[#00ffff]' : 'text-[#4e5d74] hover:text-[#8a95a3] border-b-2 border-transparent'}`}
            onClick={() => setActiveTab('design')}
          >
            {lang === 'jp' ? 'デザイン' : 'DESIGN'}
          </button>
          <button 
            className={`flex-1 py-3 text-[10px] font-bold tracking-widest transition-all ${activeTab === 'image' ? 'text-white border-b-2 border-[#00ffff]' : 'text-[#4e5d74] hover:text-[#8a95a3] border-b-2 border-transparent'}`}
            onClick={() => setActiveTab('image')}
          >
            {lang === 'jp' ? 'アセット' : 'IMAGE'}
          </button>
          <button 
            className={`flex-1 py-3 text-[10px] font-bold tracking-widest transition-all ${activeTab === 'text' ? 'text-white border-b-2 border-[#00ffff]' : 'text-[#4e5d74] hover:text-[#8a95a3] border-b-2 border-transparent'}`}
            onClick={() => setActiveTab('text')}
          >
            {lang === 'jp' ? 'テキスト' : 'TEXT'}
          </button>
        </div>

        <div className="flex border-b border-[#1e252e] bg-[#080a0d] px-5 py-3 shrink-0 justify-center">
          <div className="flex items-center gap-6 justify-center">
            <div className="flex items-center gap-2 cursor-pointer group" onClick={() => {
                  setIsEditMode(!isEditMode);
                  if (isEditMode) setSelectedBlockId(null);
                }}>
                <div className={`w-8 h-4 rounded-full flex items-center p-0.5 transition-colors ${!isEditMode ? 'bg-[#00ffff]' : 'bg-[#1e252e]'}`}>
                  <div className={`w-3 h-3 rounded-full bg-white transition-transform ${!isEditMode ? 'translate-x-4' : 'translate-x-0'}`}/>
                </div>
                <span className={`text-[10px] font-bold tracking-widest transition-colors ${!isEditMode ? 'text-[#00ffff]' : 'text-[#4e5d74] group-hover:text-white'}`}>{lang === 'jp' ? 'プレビュー表示' : 'PREVIEW MODE'}</span>
            </div>
            
            <div className="flex items-center gap-2 cursor-pointer group" onClick={() => {
                  setGridMode(gridMode === 'none' ? gridColor : 'none');
                }}>
                <div className={`w-8 h-4 rounded-full flex items-center p-0.5 transition-colors ${gridMode !== 'none' ? 'bg-[#00ffff]' : 'bg-[#1e252e]'}`}>
                  <div className={`w-3 h-3 rounded-full bg-white transition-transform ${gridMode !== 'none' ? 'translate-x-4' : 'translate-x-0'}`}/>
                </div>
                <span className={`text-[10px] font-bold tracking-widest transition-colors ${gridMode !== 'none' ? 'text-[#00ffff]' : 'text-[#4e5d74] group-hover:text-white'}`}>{lang === 'jp' ? 'グリッド表示' : 'GRID MODE'}</span>
            </div>
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
                          setOffsets(prev => ({...prev, [`${f.id}-${orientation}`]: {}}));
                          setBlockStyles(prev => ({...prev, [`${f.id}-${orientation}`]: {}}));
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
                    className={`flex-1 py-1.5 text-[10px] font-bold tracking-widest rounded-md transition-all flex items-center justify-center gap-1.5 border border-[#1e252e] bg-[#080a0d] hover:bg-red-900/30 text-rose-800 hover:text-red-400`}
                    onClick={() => {
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
                    }}
                  >
                    <RotateCcw size={12}/> {lang === 'jp' ? 'すべてリセット' : 'RESET ALL'}
                  </button>
                </div>
              </div>

              <div className="space-y-4 pt-6 border-t border-[#1e252e]">
                <div className="ss-label flex justify-between items-center">
                  <span className="flex items-center gap-1"><Settings2 size={14}/><span>OPTIONS & GRID</span></span>
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
                    className={`flex-1 min-w-[50px] py-1.5 text-[10px] font-bold tracking-widest rounded-md transition-all flex items-center justify-center gap-1.5 ${gridColor === 'dark' ? 'bg-[#2d3640] text-[#a0aec0] shadow-sm' : 'text-[#8a95a3] hover:text-[#e2e8f0]'}`}
                    onClick={() => {
                      setGridColor('dark');
                      if (gridMode !== 'none') setGridMode('dark');
                    }}
                  >
                    DARK
                  </button>
                  <button 
                    className={`flex-1 min-w-[50px] py-1.5 text-[10px] font-bold tracking-widest rounded-md transition-all flex items-center justify-center gap-1.5 ${gridColor === 'light' ? 'bg-[#2d3640] text-[#e2e8f0] shadow-sm' : 'text-[#8a95a3] hover:text-[#e2e8f0]'}`}
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

                <div className="flex gap-2">
                  <button 
                    className="flex-1 py-2 text-[10px] font-bold tracking-widest rounded-md transition-all bg-[#080a0d] border border-[#1e252e] text-[#8a95a3] hover:text-[#e2e8f0] hover:bg-[#2d3640] flex justify-center items-center gap-1"
                    onClick={() => {
                      const allData = { 
                        currentState: { imageUrl, image2Url, kicker, heading, body, body2, meta1, meta2, orientation, stylePattern, gridMode, isMonotone, blockStyles, offsets },
                        slots: [1,2,3,4].map(s => JSON.parse(localStorage.getItem(`solid-design-slot-${s}`) || 'null'))
                      };
                      const blob = new Blob([JSON.stringify(allData, null, 2)], { type: 'application/json' });
                      const url = URL.createObjectURL(blob);
                      const a = document.createElement('a');
                      a.href = url;
                      a.download = 'solid-design-export.json';
                      a.click();
                      URL.revokeObjectURL(url);
                    }}
                  >
                    <Download size={12}/> EXPORT
                  </button>
                  <label className="flex-1 py-2 text-[10px] font-bold tracking-widest rounded-md transition-all bg-[#080a0d] border border-[#1e252e] text-[#8a95a3] hover:text-[#e2e8f0] hover:bg-[#2d3640] flex justify-center items-center gap-1 cursor-pointer">
                    <Upload size={12}/> IMPORT
                    <input 
                      type="file" 
                      accept=".json" 
                      className="hidden"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (!file) return;
                        const reader = new FileReader();
                        reader.onload = (event) => {
                          try {
                            const parsed = JSON.parse(event.target?.result as string);
                            if (parsed.currentState) {
                              const cs = parsed.currentState;
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
                            }
                            if (parsed.slots && Array.isArray(parsed.slots)) {
                              const newFilled = [...filledSlots];
                              parsed.slots.forEach((slotData, idx) => {
                                const slotNum = idx + 1;
                                if (slotData) {
                                  localStorage.setItem(`solid-design-slot-${slotNum}`, JSON.stringify(slotData));
                                  if (!newFilled.includes(slotNum)) newFilled.push(slotNum);
                                } else {
                                  localStorage.removeItem(`solid-design-slot-${slotNum}`);
                                  const index = newFilled.indexOf(slotNum);
                                  if (index > -1) newFilled.splice(index, 1);
                                }
                              });
                              setFilledSlots(newFilled);
                            }
                          } catch(err) {
                            console.error("Import failed");
                          }
                        };
                        reader.readAsText(file);
                        e.target.value = '';
                      }}
                    />
                  </label>
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
              <Save size={12}/> {lang === 'jp' ? '保存' : 'SAVE DESIGN'}
            </button>
            <button 
              className="col-span-1 py-1.5 text-[10px] font-bold tracking-widest rounded-md transition-all flex items-center justify-center gap-1.5 border border-[#1e252e] bg-[#080a0d] hover:bg-[#1e252e] text-[#8a95a3]"
              onClick={handleDownload}
            >
              <Download size={12} /> {lang === 'jp' ? '画像出力' : 'EXPORT IMAGE'}
            </button>
          </div>
        </div>

        {/* Global Settings Panel (Overlays inside Sidebar) */}
        {isGlobalSettingsOpen && (
          <div 
            className="absolute inset-0 z-50 bg-[#111418] flex flex-col"
          >
            <div className="flex items-center justify-between border-b border-[#1e252e] p-5 shrink-0 bg-[#0a0c10]">
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
                <div className="text-[9px] font-bold tracking-widest text-[#4e5d74] mb-2 uppercase">{lang === 'jp' ? 'キャンバス背景色' : 'Canvas Background'}</div>
                <div className="flex items-center gap-3">
                  <div className="relative w-8 h-8 rounded-full overflow-hidden border-2 border-[#1e252e] shrink-0" style={{ filter: themeMode === 'light' ? 'invert(1) hue-rotate(180deg)' : 'none' }}>
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
                  <div className="flex gap-1 shrink-0" style={{ filter: themeMode === 'light' ? 'invert(1) hue-rotate(180deg)' : 'none' }}>
                    <button onClick={() => setCanvasBgColor('#151515')} className="w-8 h-8 rounded bg-[#151515] border border-[#1e252e] hover:border-[#4e5d74] transition-colors" title="Dark setting"></button>
                    <button onClick={() => setCanvasBgColor('#808080')} className="w-8 h-8 rounded bg-[#808080] border border-[#1e252e] hover:border-[#4e5d74] transition-colors" title="Gray setting"></button>
                    <button onClick={() => setCanvasBgColor('#ffffff')} className="w-8 h-8 rounded bg-[#ffffff] border border-[#1e252e] hover:border-[#4e5d74] transition-colors" title="White setting"></button>
                  </div>
                </div>
              </div>

              <div>
                <div className="flex justify-between items-end mb-2">
                  <div className="text-[9px] font-bold tracking-widest text-[#4e5d74] uppercase">{lang === 'jp' ? 'アートボード倍率' : 'Artboard Scale'}</div>
                  <div className="text-[10px] font-bold text-[#00ffff]">{artboardScaleParam}%</div>
                </div>
                <input 
                  type="range" 
                  min="20" 
                  max="100" 
                  value={artboardScaleParam}
                  onChange={(e) => setArtboardScaleParam(Number(e.target.value))}
                  className="w-full accent-[#00ffff]"
                />
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
                  <div className="flex flex-col gap-3">
                    <input 
                      type="range" 
                      min="10" 
                      max="100" 
                      value={statusOpacity}
                      onChange={(e) => setStatusOpacity(Number(e.target.value))}
                      className="w-full accent-[#00ffff]"
                    />
                    <div className="flex gap-2">
                      <button onClick={() => setStatusTheme('dark')} className={`flex-1 py-2 text-[10px] font-bold border rounded ${statusTheme === 'dark' ? 'bg-[#2d3640] text-[#00ffff] border-[#4e5d74]' : 'bg-[#0a0c10] text-[#8a95a3] border-[#1e252e] hover:text-[#e2e8f0]'}`}>{lang === 'jp' ? 'ダーク' : 'DARK'}</button>
                      <button onClick={() => setStatusTheme('light')} className={`flex-1 py-2 text-[10px] font-bold border rounded ${statusTheme === 'light' ? 'bg-[#2d3640] text-[#00ffff] border-[#4e5d74]' : 'bg-[#0a0c10] text-[#8a95a3] border-[#1e252e] hover:text-[#e2e8f0]'}`}>{lang === 'jp' ? 'ライト' : 'LIGHT'}</button>
                    </div>
                  </div>
                )}
              </div>

              <div>
                <div className="text-[9px] font-bold tracking-widest text-[#4e5d74] mb-2 uppercase">{lang === 'jp' ? 'サイドバー位置' : 'Sidebar Position'}</div>
                <div className="flex gap-2">
                  <button onClick={() => setSidebarPosition('left')} className={`flex-1 py-2 text-[10px] font-bold border rounded ${sidebarPosition === 'left' ? 'bg-[#2d3640] text-[#00ffff] border-[#4e5d74]' : 'bg-[#0a0c10] text-[#8a95a3] border-[#1e252e] hover:text-[#e2e8f0]'}`}>{lang === 'jp' ? '左' : 'LEFT'}</button>
                  <button onClick={() => setSidebarPosition('right')} className={`flex-1 py-2 text-[10px] font-bold border rounded ${sidebarPosition === 'right' ? 'bg-[#2d3640] text-[#00ffff] border-[#4e5d74]' : 'bg-[#0a0c10] text-[#8a95a3] border-[#1e252e] hover:text-[#e2e8f0]'}`}>{lang === 'jp' ? '右' : 'RIGHT'}</button>
                </div>
              </div>

              <div>
                <div className="text-[9px] font-bold tracking-widest text-[#4e5d74] mb-2 uppercase">Sidebar Theme</div>
                <div className="flex gap-2">
                  <button onClick={() => setThemeMode('dark')} className={`flex-1 py-2 text-[10px] font-bold border rounded ${themeMode === 'dark' ? 'bg-[#2d3640] text-[#00ffff] border-[#4e5d74]' : 'bg-[#0a0c10] text-[#8a95a3] border-[#1e252e] hover:text-[#e2e8f0]'}`}>DARK</button>
                  <button onClick={() => setThemeMode('light')} className={`flex-1 py-2 text-[10px] font-bold border rounded ${themeMode === 'light' ? 'bg-[#2d3640] text-[#00ffff] border-[#4e5d74]' : 'bg-[#0a0c10] text-[#8a95a3] border-[#1e252e] hover:text-[#e2e8f0]'}`}>LIGHT (MONO)</button>
                </div>
              </div>
            </div>
          </div>
        )}

        </div>
      </div>
      {/* Canvas Area */}
      <div 
        ref={containerRef} 
        className="flex-1 flex flex-col items-center justify-center relative overflow-hidden group/canvasarea" 
        style={{ backgroundColor: canvasBgColor }}
        onClick={() => setSelectedBlockId(null)}
      >
        <div ref={panelConstraintsRef} className="absolute inset-[30px] pointer-events-none" />
        
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
           className="relative group z-10 transition-transform duration-300"
           style={{
             width: '1200px',
             height: '900px',
             transform: `scale(${scale})`,
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
             />
           </div>

           {/* Export UI removed */}
        </div>
        
        <motion.div 
          layout
          drag
          dragMomentum={false}
          dragConstraints={panelConstraintsRef}
          className={`absolute w-[280px] font-mono tracking-widest border rounded-lg z-[100] flex-col transition-colors duration-300 backdrop-blur-md cursor-grab active:cursor-grabbing flex overflow-hidden ${
            statusTheme === 'dark' 
              ? 'bg-black/80 border-white/10 text-white shadow-black/50 shadow-2xl' 
              : 'bg-white/90 border-black/10 text-black shadow-black/20 shadow-2xl'
          }`}
          style={{ 
            opacity: showStatusText ? statusOpacity / 100 : 0, 
            pointerEvents: showStatusText ? 'auto' : 'none',
            top: '30px',
            right: '30px'
          }}
        >
          <div 
            onDoubleClick={() => setIsPanelCollapsed(!isPanelCollapsed)}
            className={`flex justify-between items-center text-[8px] px-4 py-3 cursor-pointer select-none ${isPanelCollapsed ? '' : 'border-b'} ${statusTheme === 'dark' ? 'border-[#1e252e] text-[#8a95a3]' : 'border-gray-200 text-gray-500'}`}
          >
            <span className="uppercase font-bold">Information Panel</span>
            <span>SCALE: {artboardScaleParam}%</span>
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
                <div className={`text-[10px] flex flex-col gap-1.5 px-4 pb-3 pt-2 ${statusTheme === 'dark' ? 'text-[#8a95a3]' : 'text-gray-600'}`}>
                  <div className="flex justify-between">
                    <span className={statusTheme === 'dark' ? 'text-[#4e5d74]' : 'text-gray-400'}>MODE:</span> 
                    <span className={!isEditMode ? (statusTheme === 'dark' ? 'text-[#00ffff]' : 'text-blue-600') : (statusTheme === 'dark' ? 'text-white' : 'text-black')}>{!isEditMode ? 'PREVIEW' : 'DESIGN'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className={statusTheme === 'dark' ? 'text-[#4e5d74]' : 'text-gray-400'}>GRID:</span> 
                    <span className={statusTheme === 'dark' ? 'text-white' : 'text-black'}>{stylePattern ? stylePattern.toUpperCase() : 'BLANK'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className={statusTheme === 'dark' ? 'text-[#4e5d74]' : 'text-gray-400'}>FORMAT:</span> 
                    <span className={statusTheme === 'dark' ? 'text-white' : 'text-black'}>{orientation.toUpperCase()}</span>
                  </div>
                  <div className="flex justify-between mb-1">
                    <span className={statusTheme === 'dark' ? 'text-[#4e5d74]' : 'text-gray-400'}>TARGET:</span> 
                    <span className={selectedBlockId ? (statusTheme === 'dark' ? 'text-[#00ffff]' : 'text-blue-600') : (statusTheme === 'dark' ? 'text-[#4e5d74]' : 'text-gray-400')}>{selectedBlockId ? selectedBlockId.toUpperCase() : 'NONE'}</span>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>

      {/* Bottom info text removed, let's keep only necessary parts */}
    </div>
  );
}

