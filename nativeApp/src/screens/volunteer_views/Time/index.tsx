import React, { FC } from 'react';

import TimeCard from '../../../lib/ui/TimeCard';
import Page from '../../../lib/ui/Page';
import CardSeparator from '../../../lib/ui/CardSeparator';
import ConfirmationModal from '../../../lib/ui/modals/ConfirmationModal';
import useToggle from '../../../lib/hooks/useToggle';

/*
 * Types
 */
type Props = {
}

/*
 * Styles
 */

/*
 * Component
 */
const Time: FC<Props> = () => {
  const [visibleConfirmationModal, toggleDeleteVisibility] = useToggle(false);
  return (
    <Page heading="My Time">
      <ConfirmationModal
        isVisible={visibleConfirmationModal}
        onCancel={toggleDeleteVisibility}
        onConfirm={toggleDeleteVisibility}
        title="Delete"
        text="Are you sure you want to delete this time?"
      />
      <CardSeparator title="Today" />
      <TimeCard id={1} timeValues={[2, 9]} labels={['General', 'Office Work']} date="30/04/19" onDelete={toggleDeleteVisibility} />
      <TimeCard id={1} timeValues={[7, 19]} labels={['General', 'Office Work']} date="03/06/19" onDelete={toggleDeleteVisibility} />
      <CardSeparator title="Yesterday" />
      <TimeCard id={1} timeValues={[0, 49]} labels={['General', 'Office Work']} date="15/07/19" onDelete={toggleDeleteVisibility} />
      <TimeCard id={1} timeValues={[2, 12]} labels={['General', 'Office Work']} date="30/08/19" onDelete={toggleDeleteVisibility} />
      <TimeCard id={1} timeValues={[2, 18]} labels={['General', 'Office Work']} date="30/09/19" onDelete={toggleDeleteVisibility} />
    </Page>
  );
};

export default Time;
