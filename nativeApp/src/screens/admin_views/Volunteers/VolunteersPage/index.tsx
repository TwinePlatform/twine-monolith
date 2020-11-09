import React, { FC, useState, useEffect } from 'react';
import {View} from 'react-native';
import { useSelector, useDispatch, shallowEqual } from 'react-redux';
import { NavigationFocusInjectedProps } from 'react-navigation';

import {
  loadVolunteers,
  selectOrderedVolunteers,
  selectVolunteersStatus,
  deleteVolunteer,
} from '../../../../redux/entities/volunteers';
import useToggle from '../../../../lib/hooks/useToggle';
import { User } from '../../../../../../api/src/models';

import VolunteerCard from './VolunteerCard';
import Page from '../../../../lib/ui/Page';
import AddBar from '../../../../lib/ui/AddBar';
import ConfirmationModal from '../../../../lib/ui/modals/ConfirmationModal';
import Loader from '../../../../lib/ui/Loader';
import { formatDate } from '../../../../lib/utils/time';
import { Platform } from 'react-native';
import { SearchBar } from '../../../../lib/ui/SearchBar';
import Fuse from 'fuse.js';

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

const filterVolunteers = (volunteers, filter) => {
  if(filter=="")
    return volunteers;
  else{
    const options = {
      keys: [
        "name"
      ]
    };
    const fuse = new Fuse(volunteers, options);
    let output = [];
    fuse.search(filter).map(item => output.push(item.item));
    return output;
  }
}

const Volunteers: FC<NavigationFocusInjectedProps & Props> = ({ navigation }) => {
  // Redux
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(loadVolunteers());
  }, []);

  const volunteers = useSelector(selectOrderedVolunteers, shallowEqual);
  const volunteersRequestStatus = useSelector(selectVolunteersStatus, shallowEqual);

  // React State
  const [deleteModalVisibility, toggleDeleteModalVisibility] = useToggle(false);
  const [activeCard, setActiveCard] = useState(null);
  const [filter, setFilter] = useState("");
  const [filteredVolunteers, setFilteredVolunteers] = useState(volunteers);

  useEffect(()=>{
    setFilteredVolunteers(filterVolunteers(volunteers,filter));
  },[volunteers,filter])

  // Handlers
  const onEdit = (volunteer: User) => {
    navigation.navigate('AdminEditVolunteer', volunteer);
  };

  const onDelete = (id: number) => {
    toggleDeleteModalVisibility();
    setActiveCard(id);
  };

  const onConfirm = () => {
    dispatch(deleteVolunteer(activeCard));
    toggleDeleteModalVisibility();
    // TODO: display error feedback
  };

  // TODO: error handling
  return (
    <Page heading="Volunteers" withAddBar>
      <View style={{
        //flexDirection: 'row',
         width: '100%'}}>
        <SearchBar
          placeholder="Search Volunteers"
          onChangeText={text=>setFilter(text)}
        />
        <AddBar title="Add Volunteer" onPress={() => navigation.navigate('AdminAddVolunteer')} />
      </View>
      
      {/* TODO: look into Portals for potential modal replacement */}
      <ConfirmationModal
        isVisible={deleteModalVisibility}
        title="Delete"
        text="Are you sure you want to delete this volunteer?"
        onCancel={toggleDeleteModalVisibility}
        onConfirm={onConfirm}
      />

      {Platform.OS === 'android' &&
        <Loader isVisible={volunteersRequestStatus.isFetching} />
      }
      {/* TODO: create function for loading logic */}
      {!volunteersRequestStatus.isFetching
        && !volunteersRequestStatus.error
        && filteredVolunteers.map((volunteer) => (
          <VolunteerCard
            key={volunteer.id}
            id={volunteer.id}
            title={volunteer.name}
            date={formatDate(volunteer.createdAt)}
            onDelete={() => onDelete(volunteer.id)}
            onEdit={() => onEdit(volunteer)}
          />
        ))}
    </Page>
  );
};

export default Volunteers;
