import { useEffect,useState } from 'react';
import Header from '../header/header';
import './profile.css';

function Profile()
{
    const [data,setdata]=useState([]);

    useEffect(()=>{
        document.body.style.backgroundImage="none";
        getdata();
    },[])

    async function getdata()
    {
        try{

            const result=await fetch('http://localhost:5000/profile',{
                method:"GET",
                headers: {
                    'Content-Type': 'application/json',
                  },
                credentials:"include"

            });

            if(result.ok)
                {
                    const response=await result.json();
                    setdata(response.data);
                    console.log(response.data);
                }
        }
        catch(error)
        {
            console.log(error);
        }
    }

    async function handle(id)
    {
        console.log(id);
        try{

            const result=await fetch(`http://localhost:5000/del/${id}`,{
                method:"GET",
                headers: {
                    'Content-Type': 'application/json',
                  },
                credentials:"include"

            });

            if(result.ok)
                {
                    const response=await result.json();
                    alert("deleted");
                }
        }
        catch(error)
        {
            console.log(error);
        }
    }


    return(
        <>
        <Header />
        <table>
                <thead>
                    <tr>
                        <th>Hospital Name</th>
                        <th>Equipment Make</th>
                        <th>Equipment Model</th>
                        <th>Equipment Name</th>
                        <th>Edit Response</th>
                    </tr>
                </thead>
                <tbody>
                    {data.map((item, index) => (
                        <tr key={index}>
                            <td>{item.hospitalName}</td>
                            <td>{item.equipmentMake}</td>
                            <td>{item.equipmentModel}</td>
                            <td>{item.equipmentName}</td>
                            <td><button id={item._id} onClick={(e)=>handle(e.target.id)}>Remove</button></td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </>
    )
}

export default Profile;