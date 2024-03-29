import { addDoc, collection, getDocs } from 'firebase/firestore';
import { db } from '../../firebase/service';
import { Assessment, AssessmentToPush, Course } from '../../types/types';
import MainContainer from './components/MainContainer';
import { assessments, data } from '../../firebase/data';
import { DateTime } from 'luxon';

async function getCourses() {
  console.log('===============getCourses===============');
  const coursesCollection = collection(db, 'courses');
  const courseDocs = await getDocs(coursesCollection);

  const courses: Course[] = courseDocs.docs.map(
    (doc) =>
      ({
        id: doc.id,
        ...doc.data(),
      } as Course)
  );

  return courses;
}

async function getAssessments() {
  const assCollection = collection(db, 'assessments');
  const assDocs = await getDocs(assCollection);

  const assessments: Assessment[] = assDocs.docs.map(
    (doc) =>
      ({
        id: doc.id,
        ...doc.data(),
      } as Assessment)
  );

  return assessments;
}

function convertTimeToISO(data: AssessmentToPush[]) {
  data.forEach((assignment) => {
    const [day, month, year] = assignment.dueDate.split('/');
    const dt = DateTime.fromObject(
      { day: Number(day), month: Number(month), year: Number(year) },
      { zone: 'Australia/Sydney' }
    );
    if (dt.isValid) {
      assignment.dueDate = dt.toISO() || '';
    } else {
      console.error('Invalid date conversion:', dt.invalidExplanation);
      assignment.dueDate = ''; // or set to some default value
    }
  });
  return data;
}

async function pushCourses() {
  const coursesCol = collection(db, 'courses');

  await Promise.all(
    data.map(async (course) => {
      try {
        const docRef = await addDoc(coursesCol, course);
        console.log('Document written with ID: ', docRef.id);
      } catch (err) {
        console.error(err);
      }
    })
  );
}

async function pushAssessments() {
  const assCol = collection(db, 'assessments');
  const converted = convertTimeToISO(assessments);

  await Promise.all(
    converted.map(async (assessment) => {
      try {
        const docRef = await addDoc(assCol, assessment);
        console.log('Document written with ID: ', docRef.id);
      } catch (err) {
        console.error(err);
      }
    })
  );
}

export default async function Home() {
  // Use pushCourses and pushAssessments to push a new data to the database
  // pushCourses();
  // pushAssessments();
  const courses = await getCourses();
  const assessments = await getAssessments();

  return (
    <main className="bg-white h-screen">
      <MainContainer
        courses={courses}
        assessments={assessments}
      ></MainContainer>
    </main>
  );
}
