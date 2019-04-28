import { configure } from '@storybook/react';

function loadStories() {
  require('../src/stories/Buttons');
  require('../src/stories/Input');
}

configure(loadStories, module);
