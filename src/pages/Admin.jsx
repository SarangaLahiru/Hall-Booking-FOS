import React from 'react'
import Header from '../components/header'
import Calendar3 from './calender3'
import { Badge } from 'rsuite'
import Card from '../components/card'
import Calendar from './calender'
import { width } from '@fortawesome/free-solid-svg-icons/fa0'
import { Divider } from '@mui/material'
import Table from '../components/table'
import Table1 from '../components/table'

export default function Admin() {
    return (
        <div className=''>
            <Header />
            <div className="box flex justify-center flex-wrap">
                <div className='m-5 relative lg:-left-20 sm:left-4'>
                    <Card />
                </div>
                <div className=' bg-white relative lg:-left-0 ml-0 max-sm:m-auto w-fit shadow-2xl rounded-2xl mt-16'>

                    <Calendar3 />
                    <h2 className='-mt-20 ml-10'><Badge className='' />Booking Days</h2>
                </div>

            </div>
            <div style={{ width: '850px' }} className=" max-sm:hidden m-5 shadow-2xl p-12 rounded-xl relative left-10 -top-52">
                <Calendar />
            </div>

            <div className=' lg:-mt-52 max-sm:w-96 overflow-auto p-16 mt-10 '>
                <Table1 />
            </div>



        </div >
    )
}
