import { MAIN_URL, TOKEN } from './config';

export const api = {
    createTask: async(message) => {
        const response = await fetch(MAIN_URL,{
            method:'POST',
            headers:{
                'Content-Type':'application/json',
                Authorization: TOKEN
            },
            body: JSON.stringify({message})
        });

        if (response.status === 200){
            const {data:taskObj} = await response.json();
            return taskObj;
        } else {
            return null;
        }
    },

    fetchTasks: async() => {
        const response = await fetch(MAIN_URL,{
            method:'GET',
            headers:{
                'Content-Type':'application/json',
                Authorization: TOKEN
            }
        });

        if (response.status === 200){
            const {data:tasks} = await response.json();
            return tasks;
        } else {
            return [];
        }
    },

    updateTask: async(task) => {
        const response = await fetch(MAIN_URL,{
            method:'PUT',
            headers:{
                'Content-Type':'application/json',
                Authorization:TOKEN
            },
            body: JSON.stringify([task])
        });

        if (response.status === 200){
            const {data:taskList} = await response.json();
            return taskList;
        } else {
            return [];
        }
    },

    removeTask: async(id) => {
        const response = await fetch(`${MAIN_URL}/${id}`,{
            method:'DELETE',
            headers:{
                Authorization:TOKEN
            }
        });

        if (response.status === 204){
           return true
        } else {
            return false;
        }

    }


};
