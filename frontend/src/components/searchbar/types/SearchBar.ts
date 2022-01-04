import { BasePlayer, Team } from "../../../utils/types/Types";

export interface ISearchBarProps {
    onSelectedPlayer: (player: BasePlayer| null) => void;
}