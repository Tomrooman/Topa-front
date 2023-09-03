import { Box } from '@mui/material'
import React from 'react'
import './App.css'
import Analysis from './analysis/Analysis'
import LeftMenu from './leftMenu/LeftMenu'

const App = () => {
  const [pageSelection, setPageSelection] = React.useState('Analysis')

  const renderComponentByPageSelection = (pageSelection: string) => {
    if (pageSelection === 'Analysis') {
      return <Analysis />
    }
    return <></>
  }


  return (
    <div style={{
      display: 'flex',
      height: '100%',
    }}>
      <LeftMenu pageSelection={pageSelection} setPageSelection={setPageSelection} />
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
