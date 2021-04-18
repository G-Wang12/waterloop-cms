import {
  useReducer,
  useCallback,
  useEffect,
} from 'react';
import { useHistory } from 'react-router-dom';
import api from '../../../api';
import FormData from 'form-data';

import useSponsors from "../../../hooks/sponsors";
import * as R from 'ramda';
import * as moment from 'moment';


const initialState = (inputState) => ({
  loading: true,
  userFriendlyErrorMessage: '',
  form: {
    title: '',
    description: '',
    images: [],
    imageFiles: [], // NOTE: Image files represents the user uploaded files
    // corresponding to any new entries in images.
    lastUpdated: '',
    ...inputState, // May overwrite any of the above defaults
  }
});

const reducer = (state, action) => {
  switch (action.type) {
    case 'LOAD_SUCCESS':
      return {
        ...state,
        loading: false,
        form: {
          ...state.form,
          ...action.payload.data,
        },
      };
    case 'LOAD_FAILURE':
      return {
        ...state,
        loading: false,
        userFriendlyErrorMessage: action.payload,
      };

    // Redux stores acting as react states:
    case 'UPDATE_TITLE':
      return {
        ...state,
        form: {
          ...state.form,
          title: action.payload,
        }
      }
    case 'UPDATE_DESCRIPTION':
      return {
        ...state,
        form: {
          ...state.form,
          description: action.payload,
        }
      }
    case 'UPDATE_IMAGES':
      return {
        ...state,
        form: {
          ...state.form,
          images: action.payload.images,
          imageFiles: action.payload.imageFiles
        }
      }

    default:
      return {
        ...state,
      };
  }
}

const useSponsorDescForm = (input = {}) => {
  const [state, dispatch] = useReducer(reducer, initialState(input));
  const history = useHistory();
  const {sponsorDesc} = useSponsors();

  /**
   * Load Sponsor Data by ID:
   */
  useEffect(() => {
    if (state.loading && !R.isNil(sponsorDesc)) {
      try {
        let data = {
          ...sponsorDesc, 
          imageFiles: Array(sponsorDesc.images.length).fill(null), 
          lastUpdated: moment.utc(sponsorDesc.updatedAt).local().format("MMMM D, YYYY")
        }
        dispatch({
          type: 'LOAD_SUCCESS',
          payload: {
            data
          }
        });
      } catch (err) {
          dispatch({ type: 'LOAD_FAILURE', payload: err });
      }
    }  
  }, [state.loading, dispatch, sponsorDesc]);

  /**
   * FORM Functions
   */
  const updateTitle = useCallback(
    (title) => {
      dispatch({ type: 'UPDATE_TITLE', payload: title });
    },
    [dispatch],
  );

  const updateDescription = useCallback(
    (description) => {
      dispatch({ type: 'UPDATE_DESCRIPTION', payload: description });
    },
    [dispatch],
  );

  const updateImage = useCallback(
    (newImage, newImageFile) => {
      dispatch({ type: 'UPDATE_IMAGES', payload: {
        images: [...state.form.images, newImage],
        imageFiles: [...state.form.imageFiles, newImageFile]
      }});
    },
    [dispatch, state.form.images, state.form.imageFiles],
  );

  const deleteImage = useCallback(
    (imgNum) => {
      dispatch({ type: 'UPDATE_IMAGES', payload: {
        images: state.form.images.filter((_, idx) => idx !== imgNum),
        imageFiles: state.form.imageFiles.filter((_, idx) => idx !== imgNum)
      }});
    },
    [dispatch, state.form.images, state.form.imageFiles],
  );

  /**
   * Save and close Functions
   */
  const closeForm = useCallback(() => {
    history.push('/sponsors');
  }, [history]);

  const saveForm = useCallback(async () => {
    // eslint-disable-next-line no-console
    console.log(state.form);
    // TODO: Validation checks here.


    // Send data to server:
    try {
      const files = state.form.imageFiles;
      let imgStrings = state.form.images;

      if (R.isEmpty(imgStrings)) {
        throw new Error("Requirement not satisfied: images");
      }

      // Upload files and retrieve Google Cloud Platform URL string:
      await Promise.all(files.map(async (file, idx) => {
        if (file) {
          const data = new FormData();
        
          data.append('files', file, file.name);
          const res = await api.formUpload(data);
      
          // eslint-disable-next-line no-console
          console.log("Done image upload!");
          
          const imageUrl = res.data.data[0];
          if (!imageUrl) {
            throw new Error(`Failed to upload image: ${file.name}`);

          } else {
            imgStrings[idx] = imageUrl;
          }
        }
      }));

      // Upload rest of data to server:
      let data = {
        title: state.form.title,
        description: state.form.description,
        images: imgStrings,
      };

      await api.sponsors.updateSponsorDesc(data);

      // onSuccess:
      closeForm();

    } catch (e) {
      // TODO: Display "could not add/update" error to user as dialogue.
      // eslint-disable-next-line no-console
      console.error(e);
    }
  }, [state.form, closeForm]);

  return {
    ...state.form,
    loading: state.loading,
    updateTitle,
    updateDescription,
    updateImage,
    deleteImage,
    saveForm,
    closeForm,
  };
};

export default useSponsorDescForm;
  // END Save and close functions