import React from 'react';
import { render, screen, cleanup } from '@testing-library/react';
import {mount } from 'enzyme';
import RankBox from './RankBox';
import { IRankBoxProps } from './types/RankBox';

afterEach(cleanup);

const defaultRankboxProps : IRankBoxProps  = {
    title: 'Test Title',
    rank: '200th',
    totalPlayers: 400
}

test('renders Title property', () => {
    const element = render(<RankBox title={defaultRankboxProps.title}  
        rank={defaultRankboxProps.rank} totalPlayers={defaultRankboxProps.totalPlayers} />);
        expect(element.queryByText("Test Title")).toBeTruthy();
        expect(element.queryByText("Bad Title")).not.toBeTruthy();
});