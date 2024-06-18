import { useEffect,useState } from 'react';
import './header.css';
import { useNavigate } from 'react-router-dom';
import {FaHome,FaSearch} from 'react-icons/fa';

function Header()
{

    const navigate = useNavigate();

    function route(a)
    {
        navigate(a);
    }
    async function logout()
    {

        try{
            const result=await fetch('http://localhost:5000/logout',{
                method:'GET',
                headers:{'Content-Type':'application/json'},
                credentials:'include'
                });
                if(result.ok)
                    {
                        navigate('/');
                    }
        }
        catch(error)
        {
                console.error(error);
        }
    }

    return (<>
    <div id="navbar">
        <div id="title">
        <FaSearch size="2em"/>
        <h2 id="tit_name">Equip-Manage</h2>
        </div>
        <li className='links' onClick={(e)=>route('/main')}>
            Entry
        </li>

        <li className='links' onClick={(e)=>route('/profile')}>
            Dashboard
        </li>

        <li className='links' onClick={(e)=>logout()}>
            Logout
        </li>

      
    </div>
    </>);
}

export default Header;