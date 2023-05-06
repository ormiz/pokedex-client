import * as React from 'react';
import { GridToolbarQuickFilter } from '@mui/x-data-grid';
import { Box } from '@mui/system';

export const QuickSearchToolbar = () => {
  return (
    <Box
      sx={{
        p: 0.5,
        pb: 0,
      }}
    >
      <GridToolbarQuickFilter debounceMs={500} />
    </Box>
  );
}
