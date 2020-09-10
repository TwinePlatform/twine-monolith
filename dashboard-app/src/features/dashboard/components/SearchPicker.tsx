import React, { useState, } from 'react';

type SearchPickerProps = {
    placeholder: string;
    searches: [string];
    setSearches: any;
    colour: any
  };

const SearchPicker: React.FunctionComponent<SearchPickerProps> = (props: any) => {
    const {placeholder, searches, setSearches, colour} = props;
    const [search, setSearch] = useState("");

    let searchBoxes = null;
    if(searches.length > 0){
        searchBoxes=[];
        searches.map((search: any) =>{
            searchBoxes.push(
                <div
                    style={{display: 'flex-inline', justifyContent: 'space-between', width: '50%', backgroundColor: colour}}
     
                >
                    <p>{search}</p>
                    <p onClick={()=>setSearches(searches.remove(search))}>x</p>
                </div>
            )
        })
    }

    let input = document.getElementById("input"+placeholder);

    if(input)
    input.addEventListener("keyup",(event) => {
        if (event.keyCode === 13) {
            event.preventDefault();
            setSearches(searches.concat([search]))
        }
    });

    console.log(searches);
        
    return <div>
                <input 
                    id={"input"+placeholder}
                    type="text" 
                    placeholder={placeholder} 
                    onChange={e=>setSearch(e.target.value)}
                />
                {searchBoxes}
            </div>
    
  
}

export default SearchPicker;