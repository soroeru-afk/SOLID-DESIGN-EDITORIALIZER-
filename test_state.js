const state0 = {
  'pattern-v': {
    'bgWrapper': {
      isBgColorOff: true,
      backgroundColor: '#000000'
    }
  }
};

let state = state0;
const setBlockStyles = (updater) => {
  state = updater(state);
};

const handleBlockStyleChange = (key, value, targetId) => {
  setBlockStyles(prev => {
    const activeKey = 'pattern-v';
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

handleBlockStyleChange('isBgColorOff', false, 'bgWrapper');
handleBlockStyleChange('backgroundColor', '#ff0000', 'bgWrapper');

console.log(state['pattern-v']['bgWrapper']);
