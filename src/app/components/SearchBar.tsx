'use client';

import { Autocomplete, Chip, TextField } from '@mui/material';
import { SearchBarProps } from '../../../types/types';
import { useContext, useState, useEffect } from 'react';
import SelectedCoursesContext from './SelectedCoursesContext';
import { pushSelectedCourses } from '../../../firebase/helper';

export default function SearchBar({ isLocked }: SearchBarProps) {
  const contextValue = useContext(SelectedCoursesContext);
  const [autocompleteValue, setAutocompleteValue] = useState<string[]>([]);

  if (!contextValue) {
    throw new Error(
      'SelectedCoursesContext must be used within a SelectedCoursesContext.Provider'
    );
  }

  const { courses, setSelectedCourses, userId, selectedCourses } = contextValue;
  const courseList = courses.map((course) => course.courseCode);

  useEffect(() => {
    const selectedCoursesCode = selectedCourses.map(
      (course) => course.courseCode
    );
    setAutocompleteValue(selectedCoursesCode);
  }, [selectedCourses]);

  return (
    <Autocomplete
      disablePortal
      multiple
      limitTags={4}
      id="combo-box-demo"
      options={courseList}
      value={autocompleteValue}
      sx={{
        width: '40vw', // Default width for screens wider than 872px
        '@media (max-width: 872px)': {
          width: '100%', // Full width for screens narrower than 872px
        },
      }}
      renderInput={(params) => (
        <TextField {...params} placeholder="Search Course" />
      )}
      ////// Removes warning error due to how next js renders components
      renderOption={(props, option) => {
        return (
          <li {...props} key={option}>
            {option}
          </li>
        );
      }}
      renderTags={(tagValue, getTagProps) => {
        return tagValue.map((option, index) => (
          <Chip
            {...getTagProps({ index })}
            key={option}
            label={option}
            disabled={isLocked}
          />
        ));
      }}
      /////////////////////////////////////////////////////////////////

      onChange={(event, value) => {
        setAutocompleteValue(value);
        // Filters the courses so that it contains the values
        // inside the input
        const filteredCourses = courses.filter((course) =>
          value.includes(course.courseCode)
        );

        setSelectedCourses(filteredCourses);

        async function updateSelectedCourses() {
          await pushSelectedCourses(userId, filteredCourses);
        }

        updateSelectedCourses();
      }}
    />
  );
}
