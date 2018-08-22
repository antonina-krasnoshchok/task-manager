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
    }
};
