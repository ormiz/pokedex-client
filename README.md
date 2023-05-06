# pokedex-client
1. Clone the repo the install it with npm install.
2. I used MUI DataGrid component for the project as it allows built-in features.
3. Pagination - I used the built-in Pagination feature with the optional server-side pagination option.
   As you browse through the pages, page and page size parameters are synchroinzed with the URL parameters.
   I would implement the infinite scroll bonus but unfornately it's a pro feature.
4. Sorting - I used the built-n Filtering feature with the optinal server-side sorting option.
   If you hover on the "Number" column, you should see up/down arrow for ascending/descending sorting.
   URL param is synchronized as well.
5. Filtering - I used the built-in Filtering feature with the optional server-side filtering oprion.
   If you hover on the "Type 1" column, click on the three-dots button and then you can select Filter and type the filter value.
   I implemented the bonus section and added a global search bar just right above the data grid, it simply checks
   if the search term is contained in any of the fields.
6. Theming - I used MUI general theming feature to apply dark/light modes over page.
   You can toggle light/dark mode clicking in the switch button above the data grid.
7. Bonus - I added an additional column "Captured" indicating if the pokemon is captured or not.
   If it's captured - you'll see a check icon, if not - you can click the "Capture" button and then you'll see the check icon.
   The captured state is kept as long as the server lives.
