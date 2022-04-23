import React from 'react';
import { Pagination } from 'react-bootstrap';


interface TablePaginatorProps {
    nextLink?: string;
    previousLink?: string;
    buttonHandler: (url: string) => ((event: React.MouseEvent<HTMLElement>) => void);
}

const TablePaginator: React.FC<TablePaginatorProps> = (props) => {
    return (
        <Pagination>
            {
                props.previousLink ? <Pagination.Prev onClick={props.buttonHandler(props.previousLink)} /> : null
            }
            {
                props.nextLink ? <Pagination.Next onClick={props.buttonHandler(props.nextLink)} /> : null
            }
        </Pagination>
    );
};


export { TablePaginator };