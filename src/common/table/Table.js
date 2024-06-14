import React from 'react';
import { useTable } from 'react-table';
import './TableStyle.css';
import { useNavigate } from 'react-router-dom';

const Table = ({ columns, data, baseUrl }) => {

    const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } = useTable({ columns, data });
    const navigate = useNavigate();

    return (
        <table {...getTableProps()}>
            <thead>
            {headerGroups.map((headerGroup) => (
                <tr {...headerGroup.getHeaderGroupProps()}>
                    {headerGroup.headers.map((column) => (
                        <th {...column.getHeaderProps()}>{column.render("Header")}</th>
                    ))}
                </tr>
            ))}
            </thead>
            <tbody {...getTableBodyProps()}>
            {rows.map((row) => {
                prepareRow(row);
                return (
                    <tr {...row.getRowProps()}
                        onClick={() => {
                            if (row.original.id !== null) {
                                navigate(`${baseUrl}/${row.original.id}`);
                            }
                        }}
                    >
                        {row.cells.map((cell, index) => (
                            <td id='tdComponent' key={index} {...cell.getCellProps()}>
                                {
                                    (row.original.id == null) ? <span>{"　"}</span> : <span>{cell.render("Cell")}</span>
                                }
                            </td>
                        ))}
                    </tr>

                );
            })}
            </tbody>
        </table>
    );
};

export default Table;