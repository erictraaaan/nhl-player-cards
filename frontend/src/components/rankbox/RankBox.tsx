import React from 'react';
import { IRankBoxProps } from './types/RankBox';

const RankBox = (props: IRankBoxProps) => {
    return (
    <div className='rank-wrapper'>
        <p>{props.title}</p>
        <div className='rank-box'>
          {props.rank}
        </div>
      </div>
    );
}

export default RankBox;