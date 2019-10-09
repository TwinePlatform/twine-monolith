export default (fileName) => `import React, { FC } from 'react';
import styled from 'styled-components/native'

/*
 * Types
 */
type Props = {
}

/*
 * Styles
 */
const View = styled.View\`
\`;

/*
 * Component
 */
const ${fileName}: FC<Props> = (props) => {
  return (
    <View>
    </View>
  );
};

export default ${fileName};

`;
