import React, { FC } from 'react';
// import styled from 'styled-components/native';

import TimeCard from '../../../../lib/ui/TimeCard';
import Page from '../../../../lib/ui/Page';
import useToggle from '../../../../lib/hooks/useToggle';
import DeleteModal from '../../../../lib/ui/modals/ConfirmationModal';

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
const AdminTime: FC<Props> = () => {
  const [visibleDeleteModal, toggleDeleteVisibility] = useToggle(false);
  return (
    <Page heading="Volunteers Time">
      <DeleteModal
        isVisible={visibleDeleteModal}
        onCancel={toggleDeleteVisibility}
        onConfirm={toggleDeleteVisibility}
        title="Delete"
        text="Are you sure you want to delete this time?"
      />
      <TimeCard id={1} volunteer="Kara Thrace" timeValues={[2, 9]} labels={['General', 'Office Work']} date="30/04/19" onDelete={toggleDeleteVisibility} />
      <TimeCard id={1} volunteer="Lee Adama" timeValues={[7, 19]} labels={['General', 'Office Work']} date="03/06/19" onDelete={toggleDeleteVisibility} />
      <TimeCard id={1} volunteer="Kara Thrace" timeValues={[0, 49]} labels={['General', 'Office Work']} date="15/07/19" onDelete={toggleDeleteVisibility} />
      <TimeCard id={1} volunteer="Gais Baltar" timeValues={[2, 12]} labels={['General', 'Office Work']} date="30/08/19" onDelete={toggleDeleteVisibility} />
      <TimeCard id={1} volunteer="Kara Thrace" timeValues={[2, 18]} labels={['General', 'Office Work']} date="30/09/19" onDelete={toggleDeleteVisibility} />
    </Page>

  );
};

export default AdminTime;
