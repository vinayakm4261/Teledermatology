import React, { useCallback, useState, useRef, useEffect } from 'react';
import { View } from 'react-native';
import {
  Portal,
  Searchbar,
  Card,
  Avatar,
  ActivityIndicator,
  IconButton,
} from 'react-native-paper';
import Modal from 'react-native-modal';
import { useField } from 'formik';
import { connect } from 'react-redux';

import Button from '../Button';

import { fetchDoctorsAction } from '../../actions/infoActions';
import Label from '../Typography/Label';

const DoctorPicker = ({ name, disabled = false, style = {} }) => {
  const [{ value }, , { setValue, setTouched }] = useField(name);
  const [selectorDialogVisible, setSelectorDialogVisible] = useState(false);
  const [selectedMetadata, setSelectedMetadata] = useState(null);

  const showSelectorDialog = useCallback(() => {
    setSelectorDialogVisible(true);
  }, []);

  const dismissSelectorDialog = useCallback(() => {
    setSelectorDialogVisible(false);
  }, []);

  const clearValue = useCallback(() => {
    setValue(null);
    setSelectedMetadata(null);
  }, [setValue]);

  const handleValueChange = useCallback(
    (newValue) => {
      setValue(newValue);
      setTouched(true);
    },
    [setTouched, setValue],
  );

  return (
    <>
      <View style={[{ marginTop: 12 }, style]}>
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
              right={(props) => (
                <IconButton
                  icon="close"
                  onPress={clearValue}
                  {...props}
                  size={18}
                  color="#aaaaaa"
                />
              )}
            />
          </Card>
        )}
        {!value && (
          <Button
            mode="outlined"
            disabled={disabled}
            onPress={showSelectorDialog}>
            Select Doctor
          </Button>
        )}
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

const mapDispatchToProps = (dispatch) => ({
  fetchDoctors: (text) => dispatch(fetchDoctorsAction(text)),
});

const DoctorPickerModal = connect(
  null,
  mapDispatchToProps,
)(({ fetchDoctors, visible, onDismiss, onSelected }) => {
  const searchBarRef = useRef(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(false);
  const dedupCounter = useRef(0);

  useEffect(() => {
    const query = searchQuery.trim();
    if (query !== '') {
      setLoading(true);
      const currentDedupCounter = ++dedupCounter.current;
      fetchDoctors(query).then((res) => {
        if (currentDedupCounter === dedupCounter.current) {
          setDoctors(res);
          setLoading(false);
        }
      });
    } else {
      setDoctors([]);
    }
  }, [searchQuery, fetchDoctors]);

  const handleDismiss = useCallback(() => {
    setSearchQuery('');
    setLoading(false);
    setDoctors([]);
    onDismiss();
  }, [onDismiss]);

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
        onBackdropPress={handleDismiss}
        onBackButtonPress={handleDismiss}
        onModalHide={handleDismiss}>
        <Searchbar
          placeholder="Search Doctors"
          value={searchQuery}
          onChangeText={setSearchQuery}
          style={{ margin: 12, marginBottom: 8 }}
          ref={(ref) => {
            searchBarRef.current = ref;
          }}
        />
        <View
          style={{ flexGrow: 1, paddingHorizontal: 12, paddingVertical: 0 }}>
          {loading ? (
            <View style={{ padding: 24, alignItems: 'center' }}>
              <ActivityIndicator color="white" />
            </View>
          ) : !doctors.length ? (
            searchQuery.trim() !== '' && (
              <View style={{ padding: 24, alignItems: 'center' }}>
                <Label>No matches found</Label>
              </View>
            )
          ) : (
            doctors.map(({ _id, name, profilePic, hospital, department }) => (
              <Card
                key={_id}
                style={{
                  marginVertical: 4,
                }}
                onPress={() => {
                  onSelected({ _id, name, hospital, department, profilePic });
                  handleDismiss();
                }}
                theme={{ roundness: 8 }}>
                <Card.Title
                  left={(props) => (
                    <Avatar.Image {...props} source={{ uri: profilePic }} />
                  )}
                  {...{ title: name, subtitle: `${hospital}, ${department}` }}
                />
              </Card>
            ))
          )}
        </View>
      </Modal>
    </Portal>
  );
});

export default DoctorPicker;
