import * as React from 'react';
import { useEffect, useState, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import { DataGrid, 
        GridColDef, GridRenderCellParams, 
        GridSortModel, GridFilterModel, 
        getGridStringOperators, useGridApiRef } from '@mui/x-data-grid';
import { Button } from '@mui/material';
import CheckIcon from '@mui/icons-material/Check';
import { QuickSearchToolbar } from './QuickSearchToolbar';

const API_URL = 'http://localhost:8080';

const PokedexDataGrid = () => {
  const columns: GridColDef[] = [
    { field: 'number', headerName: 'Number', filterable: false, width: 150 },
    {
      field: 'icon_url',
      headerName: 'Avater',
      sortable: false,
      filterable: false,
      renderCell: (params: GridRenderCellParams<String>) => (
        <img
        alt="avatar"
        src={params.value}
        loading="lazy"
        style={{ borderRadius: '50%' }}
      />
      )
    },
    { field: 'name', headerName: 'Name', sortable: false, filterable: false, width: 150 },
    { 
      field: 'type_one', 
      headerName: 'Type 1', sortable: false, 
      filterOperators: getGridStringOperators().filter( (operator) => {
        return operator.value === 'equals'
      }),
      width: 150 
    },
    { field: 'type_two', headerName: 'Type 2', sortable: false, filterable: false, width: 150 },
    {
      field: 'properties',
      headerName: 'Properties',
      width: 200,
      sortable: false,
      filterable: false,
      renderCell: (params: GridRenderCellParams) => (
        <div>
          <strong>Total</strong>: {params.row.total} <br/>
          <strong>Hit Points</strong>: {params.row.hit_points} <br/>
          <strong>Attack</strong>: {params.row.attack} <br/>
          <strong>Defense</strong>: {params.row.defense} <br/>
          <strong>Special Attack</strong>: {params.row.special_attack} <br/>
          <strong>Special Defense</strong>: {params.row.special_defense} <br/>
          <strong>Speed</strong>: {params.row.speed}
        </div>
      )
    },
    {field: 'generation', headerName: 'Generation', filterable: false, width: 100},
    {field: 'legendary', headerName: 'Legendary', filterable: false, type: 'boolean'},
    {
      field: 'captured', 
      headerName: 'Captured',
      width: 150,
      renderCell: (params: GridRenderCellParams) => (
        <div>
          {params.row.captured ? <CheckIcon/> : 
          <Button
              variant="contained"
              size="small"
              onClick={ async() => {
                setIsLoading(true);
                try {
                  const apiUrl = new URL(`/capture/${params.row.name}`, API_URL);
                  const response = await fetch(apiUrl.toString(), { 
                                    method: 'PUT', 
                                    headers: {
                                      'Content-Type': 'application/json'
                                    }}
                                  );
                  const pokemon = await response.json();
                  updateRow(pokemon);
                } finally {
                  setIsLoading(false);
                }
              }}
            >
              Capture
            </Button>
          }
        </div>
      ),
    }
  ];
  const apiRef = useGridApiRef();
  const [rows, setRows] = useState([]);
  const [rowCount, setRowCount] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [searchParams, setSearchParams] = useSearchParams();
  
  const [paginationModel, setPaginationModel] = useState({
    page: parseInt(searchParams.get('page') || '1') - 1,
    pageSize: parseInt(searchParams.get('size') || '10'),
  });
  const [sort, setSort] = useState<string | null>(searchParams.get('sort'));
  const [filterType, setFilterType] = useState<string | null>(searchParams.get('filterType'));
  const [globalSearch, setGlobalSearch] = useState<string | null>(searchParams.get('globalSearch'));

  const updateRow = (pokemon: any) => {
    setRows((prevRows: any) => {
      return prevRows.map((row: any) =>
        row.name === pokemon.name ? { ...pokemon } : row,
      );
    });
  };

  const handleSortModelChange = useCallback((sortModel: GridSortModel) => {
    if(sortModel && sortModel.length > 0){
      setSort(sortModel[0].sort || null);
    } else {
      setSort(null);
    }
    setQueryParameters();
    fetchData();
  },[]);

  const handleFilterModelChange = useCallback((filterModel: GridFilterModel) => {
    if(filterModel && filterModel.items.length > 0) {
      setFilterType(filterModel.items[0].value || null);
    } else {
      setFilterType(null);
    }
    if(filterModel && filterModel.quickFilterValues && filterModel.quickFilterValues.length > 0){
      setGlobalSearch(filterModel.quickFilterValues.join(' '));
    } else {
      setGlobalSearch(null);
    }
    setQueryParameters();
    fetchData();   
  }, []);

  const setQueryParameters = () => {
    const searchParams: any = {
      page: (paginationModel.page + 1).toString(),
      size: (paginationModel.pageSize).toString()
    };
    if(sort){
      searchParams.sort = sort;
    }
    if(filterType){
      searchParams.filterType = filterType;
    }
    if(globalSearch){
      searchParams.globalSearch = globalSearch;
    }
    setSearchParams(searchParams);
  };

  const getApiUrl = () => {
    const apiUrl = new URL('/', API_URL);
    apiUrl.searchParams.set(
      'start',
      `${paginationModel.page * paginationModel.pageSize}`,
    );
    apiUrl.searchParams.set('size', `${paginationModel.pageSize}`);
    if(sort){
      apiUrl.searchParams.set('sort', sort);
    }
    if(filterType){
      apiUrl.searchParams.set('filterType', filterType);
    }
    if(globalSearch){
      apiUrl.searchParams.set('globalSearch', globalSearch);
    }
    return apiUrl;
  };

  const fetchData = async () => {
    setIsLoading(true);
    const apiUrl = getApiUrl();
    try {
      const response = await fetch(apiUrl.href);
      const data = await response.json();
      setRows(data.pokemons);
      setRowCount(data.totalCount);
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    setQueryParameters();
    fetchData();
  }, [paginationModel.page, paginationModel.pageSize, sort, filterType, globalSearch]);

  
  return (
    <div>
      <DataGrid getRowId={(row) => row.name} rows={rows} columns={columns}
        paginationModel={paginationModel}
        onPaginationModelChange={setPaginationModel}
        rowCount={rowCount}
        pageSizeOptions={[5, 10, 25, 50, 100]}
        paginationMode='server'
        sortingMode='server'
        loading={isLoading}
        getRowHeight={() => 'auto'}
        onSortModelChange={handleSortModelChange}
        filterMode='server'
        onFilterModelChange={handleFilterModelChange}
        apiRef={apiRef}
        components={{ Toolbar: QuickSearchToolbar }}
        />
    </div>
  );
};

export default PokedexDataGrid;