import React, { FC, useState, useEffect } from 'react';
import styled from 'styled-components/native';
import { withNavigation, NavigationInjectedProps } from 'react-navigation';
import CardWithButtons from '../CardWithButtons';
import API from '../../../api';

import { ColoursEnum } from '../colours';
import { FontsEnum } from '../typography';
import { HourAndMinutesText } from '../HoursAndMinutesText';
import { DeleteButtonConfig } from '../CardWithButtons/types';
import NoteButton from '../NoteButton';

/*
 * Types
 */
type Props = {
  id: number;
  volunteer?: string;
  timeValues: [number, number];
  startTime: string;
  date: string;
  labels: [string, string];
  onDelete: () => void;
  setNoteDisplay: any;
  toggleVisibilityNoteModal: any;
  navigationPage: string
}

/*
 * Styles
 */
const DetailsContainer = styled.View<{ topPadding: boolean }>`
  ${({ topPadding }) => topPadding && 'marginTop: 5;'}
  flexDirection: row;
  alignItems: flex-end;
`;

const NoteContainer = styled.View`
  flexDirection: row;
  justifyContent: flex-end;
`;

const LabelContainer = styled.View`
  flexDirection: column;
  flex: 1;
`;

const Label = styled.Text<{ bold?: boolean; textAlign: string }>`
  textAlign: ${(props) => props.textAlign};
  color: ${ColoursEnum.darkGrey};
  fontFamily: ${(props) => (props.bold ? FontsEnum.medium : FontsEnum.light)}
  fontSize: 15;
  letterSpacing: 1.2;
  paddingBottom: 6;
`;

const getNote = async (id) => {
  let potentialNoteData = await API.Notes.get(id);

  if (potentialNoteData[0].notes != null)
    return potentialNoteData[0].notes;
  else
    return "";
}
/*
 * Component
 */
const TimeCard: FC<NavigationInjectedProps & Props> = (props) => {
  const {
    id, timeValues, startTime, date, labels, volunteer, navigation, onDelete, setNoteDisplay, toggleVisibilityNoteModal, navigationPage
  } = props;

  const [noteExists, setNoteExist] = useState(false);
  const [note, setNote] = useState("");
  const [initialised, setInitialised] = useState(false);

  useEffect(()=>{
    if(!initialised)
      getNote(id)
      .then(returnedNote => {
        if(returnedNote.length>0){
          setNote(returnedNote);
          setNoteExist(true);
      }
      setInitialised(true);
    })
  });

  const buttonConfig: DeleteButtonConfig = {
    buttonType: 'delete',
    onDelete,
    onEdit: () => {
      navigation.navigate(navigationPage, {
        logId: id,
        labels,
        volunteer,
        startTime,
        date,
        note,
        timeValues,
      });
    },
  };

  return (
    <CardWithButtons buttonConfig={buttonConfig}>
      <HourAndMinutesText align="left" timeValues={timeValues} />
      <DetailsContainer topPadding={Boolean(volunteer)}>
        <LabelContainer>
          <Label textAlign="left">{date}</Label>
          {volunteer && <Label textAlign="left" bold>{volunteer}</Label>}
        </LabelContainer>
        <LabelContainer>
          <Label textAlign="right" bold>{labels[0]}</Label>
          <Label textAlign="right" bold>{labels[1]}</Label>
        </LabelContainer>
      </DetailsContainer>
      {noteExists && <NoteContainer>
          <NoteButton label={"View note"} onPress={()=>{setNoteDisplay(note);toggleVisibilityNoteModal();}}/>
      </NoteContainer>}
    </CardWithButtons>
  );
};

export default withNavigation(TimeCard);
