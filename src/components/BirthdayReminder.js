import React, { useState, useEffect } from 'react';
import { collection, addDoc, deleteDoc, getDocs, query, where, updateDoc, doc} from "firebase/firestore";
import { db } from "../utils/firebase.utils.js";
import { getAuth } from "firebase/auth";
import { toast } from 'react-toastify';
//Test comment by Akhmad
const BirthdayReminder = () => {
  const [birthdays, setBirthdays] = useState([]);
  const [originalBirthdays, setOriginalBirthdays] = useState([]);
  const [newBirthday, setNewBirthday] = useState({ name: '', date: '', notes: '' });
  const [searchTerm, setSearchTerm] = useState('');

  const auth = getAuth();
  const userId = auth.currentUser.uid; 

  useEffect(() => {
    const fetchData  = async () => {
      const birthdayList = await fetchBirthdays() || [];
      setBirthdays(birthdayList);
      setOriginalBirthdays(birthdayList);
    };
    fetchData();
  // eslint-disable-next-line
  }, []);
  
  const fetchBirthdays = async () => {
    const q = query(collection(db, "birthdays"), where("userId", "==", userId))
    const querySnapshot = await getDocs(q)
    const birthdayData = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    })).map(birthday => ({
      ...birthday,
      date: birthday.date.toDate() 
    }))

    // Check if any birthday is passed and update in Firestore
    const updatedBirthdays = await Promise.all(birthdayData.map(async birthday => {
      if (birthday.date < new Date()) {
        const nextYear = new Date(birthday.date.getFullYear(), birthday.date.getMonth(), birthday.date.getDate());
        const thisYear = new Date()
        nextYear.setFullYear(thisYear.getFullYear() + 1);
        await updateDoc(doc(db, "birthdays", birthday.id), { date: nextYear });
        return { ...birthday, date: nextYear };
      } else {
        return birthday;
      }
    }));
    return updatedBirthdays.sort(sortBirthdaysByDate);
  };

  const sortBirthdaysByDate = (a, b) => {
    const dateA = new Date(a.date);
    const dateB = new Date(b.date);
    return dateA - dateB;
  };
  //Add Birthday
  const addBirthday = async () => {
    if (newBirthday.name.trim() === '' || newBirthday.date.trim() === '') {
      toast.error('Please enter both name and date.');
      return;
    }

    const [year, month, day] = newBirthday.date.split('-');
    const newDate = new Date(year, month - 1, day);
    const today =  new Date()
    if (newDate < today) {
      newDate.setFullYear(today.getFullYear() + 1)
    }
    await setBirthdayInDB(newBirthday.name, newDate, newBirthday.notes);
    setBirthdays([...birthdays, { ...newBirthday, date: newDate }]);
    setNewBirthday({ name: '', date: '', notes: '' });
    toast.success('Birthday added!');
  };
  
  const setBirthdayInDB = async (name, date, notes) => {
    await addDoc(collection(db, "birthdays"), {
      userId: userId,
      name, date, notes
    });
  };

  //Input Handlers
  const handleInputChange = (e) => {
    setNewBirthday({ ...newBirthday, [e.target.name]: e.target.value });
  };

  const handleSearchChange = (e) => {
    const searchTerm = e.target.value.trim().toLowerCase();
    setSearchTerm(searchTerm);
  
    if (searchTerm === '') {
      setBirthdays(originalBirthdays);
    } else {
        const filtered = originalBirthdays.filter((birthday) =>
        birthday.name.toLowerCase().includes(searchTerm)
      );
      setBirthdays(filtered);
    }
  };

  const handleDeleteButtonClick = async (e, id) => {
    try {
      await deleteDoc(doc(db, "birthdays", id));
      const updatedBirthdays = birthdays.filter((birthday) => birthday.id !== id);
      setBirthdays(updatedBirthdays);
      setOriginalBirthdays(updatedBirthdays);
      toast.success("Birthday deleted successfully!");
    } catch (error) {
      console.error("Error deleting birthday: ", error);
      toast.error("Failed to delete birthday.");
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10">
      <div className="text-center">
        <h1 className="text-3xl font-bold mb-6">Birthday Reminder</h1>
        <div className="flex mb-6">
          <input
            type="text"
            name="name"
            placeholder="Name"
            value={newBirthday.name}
            onChange={handleInputChange}
            className="rounded px-4 py-2 w-1/2 mr-2"
          />
          <input
            type="date"
            name="date"
            value={newBirthday.date}
            onChange={handleInputChange}
            className="rounded px-4 py-2 w-1/2"
          />
          <button
            onClick={addBirthday}
            className="bg-primary text-primary-content px-4 py-2 rounded ml-2"
          >
            Add Birthday
          </button>
        </div>
        <div className='mb-10'>
          <input 
            type="text" 
            name="notes"
            placeholder="Gifts go here :-)" 
            onChange={handleInputChange}
            value={newBirthday.notes}
            className="input input-bordered primary-content w-full max-w-xs"
          />
        </div>
      </div>
      
      <div className='text-center'>
        <h2 className="text-2xl font-bold mb-4">All Birthdays</h2>
        <div className="mb-6">
          <input
            type="text"
            placeholder="Search birthdays..."
            value={searchTerm}
            onChange={handleSearchChange}
            className="input input-bordered w-full max-w-xs"
          />
        </div>
        <ul className="border rounded p-4">
          {birthdays.map((birthday, index) => (
            <div className='flex'>
              <li className="dropdown flex-auto mb-2 w-full" key={index}>
                <div tabIndex={0} role="button" className="btn w-full flex-auto">{birthday.name} - {birthday.date.toDateString()}</div>
                <div tabIndex={0} className="dropdown-content z-[1] card card-compact shadow  w-full bg-primary text-primary-content">
                  <div className="card-body">
                    <h4 className="card-title">{birthday.notes ? birthday.notes : "No gits planned ("}</h4>
                  </div>
                </div>
              </li>
              <button className="btn btn-error ml-3" onClick={(e) => handleDeleteButtonClick(e, birthday.id)}>Delete</button>
            </div>
          ))}
        </ul>
      </div>
      
    </div>
  );
};

export default BirthdayReminder;
