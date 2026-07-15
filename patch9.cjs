const fs = require('fs');
let content = fs.readFileSync('App.tsx', 'utf8');

// 1. isHeaderOpen to true
content = content.replace(
  /const \[isHeaderOpen, setIsHeaderOpen\] = useState<boolean>\(false\);/,
  'const [isHeaderOpen, setIsHeaderOpen] = useState<boolean>(true);'
);

// 2. Add artboardScaleParam and artboardOffset to saved state
content = content.replace(
  /const state = \{\n      imageUrl, image2Url, kicker, heading, body, body2, meta1, meta2, \n      orientation, stylePattern, offsets, blockStyles,\n      isMonotone\n    \};/,
  `const state = {
      imageUrl, image2Url, kicker, heading, body, body2, meta1, meta2, 
      orientation, stylePattern, offsets, blockStyles,
      isMonotone, artboardScaleParam, artboardOffset
    };`
);
content = content.replace(
  /\}, \[imageUrl, image2Url, kicker, heading, body, body2, meta1, meta2, orientation, stylePattern, offsets, blockStyles, isMonotone\]\);/,
  '}, [imageUrl, image2Url, kicker, heading, body, body2, meta1, meta2, orientation, stylePattern, offsets, blockStyles, isMonotone, artboardScaleParam, artboardOffset]);'
);

content = content.replace(
  /const \[artboardScaleParam, setArtboardScaleParam\] = useState<number>\(92\);/,
  'const [artboardScaleParam, setArtboardScaleParam] = useState<number>(initialState.artboardScaleParam ?? 92);'
);
content = content.replace(
  /const \[artboardOffset, setArtboardOffset\] = useState\(\{ x: 0, y: 0 \}\);/,
  'const [artboardOffset, setArtboardOffset] = useState(initialState.artboardOffset ?? { x: 0, y: 0 });'
);

// 3. Move Information panel slightly left
content = content.replace(
  /top: '30px',\n            right: '30px'\n          \}\}/,
  `top: '30px',
            right: '80px'
          }}`
);

fs.writeFileSync('App.tsx', content);
