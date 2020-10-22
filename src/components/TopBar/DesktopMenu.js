import React from 'react';
import styled from 'styled-components';
import MUIGrid from '@material-ui/core/Grid';
import FeaturesPageSVG from '../../assets/page-icons/features.svg';
import GeesePageSVG from '../../assets/page-icons/geese.svg';
import RecruitmentPageSVG from '../../assets/page-icons/recruitment.svg';
import SponsorsPageSVG from '../../assets/page-icons/sponsors.svg';
import TeamDescriptionsPageSVG from '../../assets/page-icons/team-descriptions.svg';
import UnstyledPagePreview from './PagePreview';

const PagePreview = styled(UnstyledPagePreview)``;
const Grid = styled(MUIGrid)``;

const Arrow = styled.div`
  width: 0;
  height: 0;
  border-left: 14px solid transparent;
  border-right: 14px solid transparent;

  border-bottom: 16px solid ${({ theme }) => theme.colours.greys.grey1};
`;

const MainBox = styled(Grid).attrs({ container: true })`
  background-color: ${({ theme }) => theme.colours.greys.grey1};
  box-shadow: ${({ theme }) => theme.shadows.shadow1};
  border-radius: 15px;
  min-height: 100px;
  min-width: 100px;
  padding-top: 16px;
  padding-bottom: 16px;
  padding-left: 16px;
  padding-right: 16px;

  ${Grid} {
    padding-top:16px;
    padding-bottom: 16px;
  }

`;
const Container = styled.div`
  ${Arrow} {
    position: absolute;
    top: -11px;
    left: 8px;
  }
`;

const DesktopMenu = ({ className, onClose }) => {
  return (
    <Container className={className}>
      <Arrow />
      <MainBox>
        <Grid xs={4}>
          <PagePreview icon={GeesePageSVG} onClick={() => alert('clicked')} pageName="Geese" />
        </Grid>
        <Grid xs={4}>
          <PagePreview icon={FeaturesPageSVG} onClick={() => alert('clicked')} pageName="Features" />
        </Grid>
        <Grid xs={4}>
          <PagePreview icon={TeamDescriptionsPageSVG} onClick={() => alert('clicked')} pageName="Team Descriptions" />
        </Grid>
        <Grid xs={4}>
          <PagePreview icon={SponsorsPageSVG} onClick={() => alert('clicked')} pageName="Sponsors Descriptions" />
        </Grid>
        <Grid xs={4}>
          <PagePreview icon={RecruitmentPageSVG} onClick={() => alert('clicked')} pageName="Current Openings" />
        </Grid>
      </MainBox>
    </Container>
  );
};

export default DesktopMenu;
