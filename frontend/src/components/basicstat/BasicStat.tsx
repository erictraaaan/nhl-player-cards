import React from 'react';
import { IBasicStatProps } from './types/BasicStat';
import './BasicStat.scss';
const BasicStat = (props: IBasicStatProps) => {
    return (
        <div className="stat">
            <p>{props.value} {props.title}</p>
        </div>
    );
}

export default BasicStat