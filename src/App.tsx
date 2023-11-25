import CandlestickChartIcon from '@mui/icons-material/CandlestickChart'
import QueryStats from '@mui/icons-material/QueryStats'
import { Box } from '@mui/material'
import React from 'react'
import './App.css'
import Chart from './chart/Chart'
import LeftMenu from './leftMenu/LeftMenu'
import Stats from './stats/stats'

const leftMenuChoices = [{ name: 'Chart', icon: <CandlestickChartIcon /> }, { name: 'Stats', icon: <QueryStats /> }];

const App = () => {
  const [pageSelection, setPageSelection] = React.useState('Chart')

  const renderComponentByPageSelection = (pageSelection: string) => {
    if (pageSelection === 'Chart') {
      return <Chart />
    }
    if (pageSelection === 'Stats') {
      return <Stats />
    }
    return <></>
  }


  return (
    <div style={{
      display: 'flex',
      height: '100%',
    }}>
      <LeftMenu pageSelection={pageSelection} choices={leftMenuChoices} setPageSelection={setPageSelection} />
      <Box
        component="main"
        sx={{ flexGrow: 1, bgcolor: 'background.default', p: 3, padding: '8px', paddingBottom: 0 }}
      >
        {renderComponentByPageSelection(pageSelection)}
      </Box>
    </div>
  )
}

export default App
