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
        
    return <div>
                <input 
                    type="text" 
                    placeholder={placeholder} 
                    onChange={e=>setSearch(e.target.value)}
                    onKeyUp={e=>e.keyCode==13?setSearches(searches.concat([search])):null}
                />
                {searchBoxes}
            </div>
    
  
}

export default SearchPicker;