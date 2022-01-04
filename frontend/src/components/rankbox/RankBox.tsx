import React from 'react';
import { IRankBoxProps } from './types/RankBox';

const RankBox = (props: IRankBoxProps) => {

    const getRankNumber = (rawRankString: string): number => {
        var numbersOnlyString = rawRankString.replace(/\D/g, "");
        return Number(numbersOnlyString);
    }

    const getRankPercentage = (rank: number, totalPlayers: number): number => {
        return 1 - (rank / totalPlayers);
    }

    const getColourMix = (percent: number): string => {
        const hue = (percent*100).toString();
        return ["hsla(",hue,",100%,50%,1)"].join("");
    }

    const getRankColourValue = (): string => {
        const rankValue = getRankNumber(props.rank);
        const rankPercent = getRankPercentage(rankValue, props.totalPlayers);
        return getColourMix(rankPercent);
    }

    const getStyle = (): React.CSSProperties => {
        return {
            backgroundColor :  getRankColourValue()

        }
    }

    return (
    <div className='rank-wrapper'>
        <p>{props.title}</p>
        <div className='rank-box' style={getStyle()}>
          {props.rank}
        </div>
      </div>
    );
}

export default RankBox;