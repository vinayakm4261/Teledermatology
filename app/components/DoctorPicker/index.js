import React, { useCallback, useState, useRef, useEffect } from 'react';
import { View } from 'react-native';
import { useTheme, Portal, Searchbar, Card, Avatar } from 'react-native-paper';
import Modal from 'react-native-modal';
import { useField } from 'formik';
import { connect } from 'react-redux';

import Button from '../Button';

import { fetchDoctorsAction } from '../../actions/infoActions';

const DoctorPicker = ({ name, disabled = false, style = {} }) => {
  const [{ value }, { touched, error }, { setValue, setTouched }] = useField(
    name,
  );
  const [selectorDialogVisible, setSelectorDialogVisible] = useState(false);
  const [selectedMetadata, setSelectedMetadata] = useState(null);

  const dismissSelectorDialog = useCallback(
    () => setSelectorDialogVisible(false),
    [],
  );

  const handleValueChange = useCallback(
    (newValue) => {
      setValue(newValue);
      setTouched(true);
    },
    [setTouched, setValue],
  );

  const showDoctorPicker = () => {
    setSelectorDialogVisible(true);
  };

  return (
    <>
      <View style={style}>
        {!!selectedMetadata && (
          <Card
            style={{
              marginVertical: 4,
            }}
            theme={{ roundness: 8 }}>
            <Card.Title
              left={(props) => (
                <Avatar.Image
                  {...props}
                  source={{ uri: selectedMetadata.profilePic }}
                />
              )}
              {...{
                title: selectedMetadata.name,
                subtitle: `${selectedMetadata.hospital}, ${selectedMetadata.department}`,
              }}
            />
          </Card>
        )}
        <Button
          compact
          mode="outlined"
          disabled={disabled}
          onPress={showDoctorPicker}>
          {!value ? 'Select Doctor' : 'Change Doctor'}
        </Button>
      </View>
      <DoctorPickerModal
        visible={selectorDialogVisible}
        onDismiss={dismissSelectorDialog}
        onSelected={({ _id, ...metadata }) => {
          setSelectedMetadata(metadata);
          handleValueChange(_id);
        }}
      />
    </>
  );
};

const mapStateToProps = (state) => ({
  doctors: state.infoReducer.doctors,
});

const mapDispatchToProps = (dispatch) => ({
  fetchDoctors: (text) => dispatch(fetchDoctorsAction(text)),
});

const DoctorPickerModal = connect(
  mapStateToProps,
  mapDispatchToProps,
)(({ doctors, fetchDoctors, visible, onDismiss, onSelected }) => {
  const searchBarRef = useRef(null);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    fetchDoctors(searchQuery);
  }, [searchQuery, fetchDoctors]);

  return (
    <Portal>
      <Modal
        useNativeDriver
        hideModalContentWhileAnimating
        backdropOpacity={0.75}
        style={{
          justifyContent: 'flex-start',
          padding: 0,
          margin: 0,
        }}
        animationIn="slideInDown"
        animationOut="slideOutUp"
        isVisible={visible}
        onModalShow={() => {
          searchBarRef.current.focus();
        }}
        onBackdropPress={onDismiss}
        onBackButtonPress={onDismiss}
        onModalHide={onDismiss}>
        <Searchbar
          placeholder="Search Doctors"
          value={searchQuery}
          onChangeText={setSearchQuery}
          style={{ margin: 12 }}
          ref={(ref) => {
            searchBarRef.current = ref;
          }}
        />
        <View
          style={{ flexGrow: 1, paddingHorizontal: 12, paddingVertical: 0 }}>
          {doctors.map(({ _id, name, profilePic, hospital, department }) => (
            <Card
              style={{
                marginVertical: 4,
              }}
              onPress={() => {
                onSelected({ _id, name, hospital, department, profilePic });
                setSearchQuery('');
                onDismiss();
              }}
              theme={{ roundness: 8 }}>
              <Card.Title
                left={(props) => (
                  <Avatar.Image {...props} source={{ uri: profilePic }} />
                )}
                {...{ title: name, subtitle: `${hospital}, ${department}` }}
              />
            </Card>
          ))}
        </View>
      </Modal>
    </Portal>
  );
});

export default DoctorPicker;
