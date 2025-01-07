import {Chip} from "@mui/material";


function ActiveFilters({filters, onDelete}) {
    return (
        <div style={{ display: 'inline-block', marginBottom: 8 }}>
            {Object.keys(filters).map(key => (
                <Chip
                    key={key}
                    label={filters[key]['label']}
                    onDelete={() => onDelete(key)}
                    size='small'
                    style={{ margin: '2px' }}
                />
            ))}
        </div>
    )
}

export default ActiveFilters