import React, { useState, useEffect } from 'react';

type SearchPickerProps = {
    placeholder: string;
    searches: [string];
    setSearches: any;
    colour: any
  };

const SearchPicker: React.FunctionComponent<SearchPickerProps> = (props: any) => {
    const {placeholder, searches, setSearches, colour} = props;
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("");

    let searchBoxes = null;
    if(searches.length > 0){
        searchBoxes=[];
        searches.map((search: any) =>{
            searchBoxes.push(
                <div
                    style={{display: 'inline-flex', justifyContent: 'space-between', width: '50%', backgroundColor: colour}}
     
                >
                    <p>{search}</p>
                    <div onClick={()=>{
                        console.log("clicked");
                        setSearches(searches.splice(searches.indexOf(search),1));
                    }}>x</div>
                </div>
            )
        })
    }

    useEffect(()=>{
        if(loading){
            let input = document.getElementById("input" + placeholder);

            if(input){
                input.addEventListener("keyup",(event) => {
                    if (event.keyCode === 13) {
                    console.log("pressed enter")
                    setSearches(searches.concat([search]))
                }
            });
                setLoading(false);
            }
        }
    });

    
        
    return <div>
                <input 
                    id={"input" + placeholder}
                    type="text" 
                    placeholder={placeholder} 
                    onChange={e=>setSearch(e.target.value)}
                    onKeyUp={e=>console.log(e)}
                />
                <div
                    style={{display: 'block'}}
                >
                    {searchBoxes}
                </div>
            </div>
    
  
}

export default SearchPicker;