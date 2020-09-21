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
    const [oldSearch, setOldSearch] = useState("");

    let searchBoxes = null;

    if(searches.length > 0){
        searchBoxes=[];
        searches.map((search: any) =>{
            searchBoxes.push(
                <div
                    style={{
                        display: 'inline-flex', 
                        justifyContent: 'space-between', 
                        width: '100%', 
                        backgroundColor: colour,
                        margin: '10px',
                        padding: '5px',
                        borderRadius: '5px',
                    }}
     
                >
                    <p style={{color: 'black'}}>{search}</p>
                    <div 
                    style={{userSelect: 'none', paddingLeft: '10px'}}
                    onClick={()=>{
                        onClickX(search);
                    }}>x</div>
                </div>
            )
        })
    }

    const onEnter = (event: any) => {
        if (event.keyCode === 13) {
            if(search != "")
                setSearches(searches.concat([search]))
        }
    }

    const onClickX = (search: any) => {
        const removeIndex = searches.indexOf(search);
        console.log(searches);
        console.log(removeIndex);
        if(searches.length < 2) 
            setSearches([]);
        else
            setSearches(searches.slice(0,removeIndex).concat(searches.slice(removeIndex+1)));
    }

    useEffect(()=>{
        if(loading || search != oldSearch){
            let input = document.getElementById("input" + placeholder);

            if(input){
                input.addEventListener("keyup",onEnter)
            };
                setLoading(false);
                setOldSearch(search);
            }
        }
    );    
        
    return <div style={{padding: '10px'}}>
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