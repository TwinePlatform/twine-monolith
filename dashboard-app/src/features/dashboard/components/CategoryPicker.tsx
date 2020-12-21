import React from 'react';

type CategoryPickerProps = {
    placeholder: string;
    searches: [string];
    setSearches: any;
    colour: any
};

const CategoryPicker: React.FunctionComponent<CategoryPickerProps> = (props: any) => {
    const {placeholder, searches, setSearches, colour} = props;

    let searchBoxes = null;

    if(searches.length > 0){
        searchBoxes=[];
        searches.map((search: any) =>{
            return searchBoxes.push(
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

    const addToSearches = (search: string) => {
        if (searches.indexOf(search) < 0) {
            if(search !== "")
                setSearches(searches.concat([search]))
        }
    }

    const onClickX = (search: any) => {
        const removeIndex = searches.indexOf(search);
        if(searches.length < 2) 
            setSearches([]);
        else
            setSearches(searches.slice(0,removeIndex).concat(searches.slice(removeIndex+1)));
    }

    return <div style={{padding: '10px'}}>
                <select id={"input" + placeholder}
                onChange={e=>addToSearches(e.target.value)}
                >
                    <option value="" disabled selected>Category</option>
                    <option value="Name">Name</option>
                    <option value="Project">Project</option>
                    <option value="Activity">Activity</option>
                </select>
                <div
                    style={{display: 'block'}}
                >
                    {searchBoxes}
                </div>
            </div>
    
}

export default CategoryPicker;