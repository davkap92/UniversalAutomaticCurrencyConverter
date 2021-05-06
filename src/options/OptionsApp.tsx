import styled from "styled-components";
import * as React from 'react'
import {useEffect, useState} from 'react'
import {TitleCard} from "./TitleCard";
import {CurrencyCard} from "./CurrencyCard";
import {LoadingCard} from "./LoadingCard";
import {DisableCurrenciesCard} from "./DisableCurrenciesCard";
import {AccessibilityCard} from "./AccessibilityCard";
import {LocalizationCard} from "./LocalizationCard";
import {FormattingCard} from "./FormattingCard";
import {HighlightCard} from "./HighlightCard";
import {DisplayCard} from "./DisplayCard";
import {AllowanceCard} from "./AllowanceCard";
import {ShortcutCard} from "./ShortcutCard";
import {FirstTimeProgressCard} from "./FirstTimeProgressCard";
import {useProvider} from "../Infrastructure";
import {StyleTheme, ThemeType} from '../Atoms/StyleTheme';
import {ThemeCard} from './ThemeCard';

type Props = { setTheme: React.Dispatch<React.SetStateAction<ThemeType>> }
export default function OptionsApp(props: Props): JSX.Element {
    const [isLoading, setIsLoading] = useState(true);
    const [firstTimeProgress, setFirstTimeProgress] = useState(0);
    const {configuration} = useProvider()

    useEffect(() => {
        configuration.load().then(() => setIsLoading(false))
    }, [])

    function wrap(children: any) {
        return <Background>
            <Space/>
            <Wrapper>
                <TitleCard key="TitleCard-card"/>
                {children}
            </Wrapper>
        </Background>
    }

    if(isLoading) return wrap(<LoadingCard key="LoadingCard-card"/>)

    const settings = [
        <CurrencyCard key="CurrencyCard-card"/>,
        <DisableCurrenciesCard key="DisableCurrenciesCard-card"/>,
        <ShortcutCard key="ShortcutCard-card"/>,
        <AccessibilityCard key="AccessibilityCard-card"/>,
        <LocalizationCard key="LocalizationCard-card"/>,
        <ThemeCard setTheme={props.setTheme} key="ThemeCard-card"/>,
        <FormattingCard key="FormattingCard-card"/>,
        <HighlightCard key="HighlightCard-card"/>,
        <DisplayCard key="DisplayCard-card"/>,
        <AllowanceCard key="AllowanceCard-card"/>
    ]

    if(configuration.firstTime.isFirstTime.value) return wrap([
        <Wrapper>{settings[firstTimeProgress]}</Wrapper>,
        <FirstTimeProgressCard
            progress={Math.min(100, 100 * firstTimeProgress / settings.length)}
            skip={() => configuration.firstTime.isFirstTime.setAndSaveValue(false)}
            next={() => setFirstTimeProgress(firstTimeProgress + 1)}/>
    ])

    return wrap(settings);
}

const Background = styled.div`
  width: 100%;
  min-height: 100%;
  height: fit-content;
  background-color: ${(props: StyleTheme) => props.theme.wrapperBackground};
  color: ${(props: StyleTheme) => props.theme.normalText};
  padding: 0;
  margin: 0;
`;

const Space = styled.div`
  height: 20px;
`

const Wrapper = styled.div`
  max-width: 800px;
  width: 100%;
  margin-left: auto;
  margin-right: auto;
`;