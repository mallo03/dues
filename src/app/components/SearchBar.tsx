'use client';

import { Autocomplete, Chip, TextField } from '@mui/material';
import { Course } from '../../../types/types';
import { useContext, useState } from 'react';
import SelectedCoursesContext from './SelectedCoursesContext';

export default function SearchBar() {
  const contextValue = useContext(SelectedCoursesContext);
  const [autocompleteValue, setAutocompleteValue] = useState<string[]>([]);

  if (!contextValue) {
    throw new Error(
      'SelectedCoursesContext must be used within a SelectedCoursesContext.Provider'
    );
  }

  const { courses, setSelectedCourses } = contextValue;

  const courseList = courses.map((course) => course.courseCode);

  return (
    <Autocomplete
      disablePortal
      multiple
      limitTags={4}
      id="combo-box-demo"
      options={courseList}
      value={autocompleteValue}
      sx={{ width: '40vw' }}
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
          <Chip {...getTagProps({ index })} key={option} label={option} />
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
      }}
    />
  );
}
