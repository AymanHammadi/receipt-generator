import
{
TextField,
MenuItem,

}
 from '@mui/material';
import Grid from '@mui/material/Grid';

const Input = ({ name, label, value,  type,onChange, error, helperText, selectOptions, size ,xs, md }) => {
  return (
    <Grid size={{ xs: xs, md: md }}>
      {type === 'select' ? (
    
          <TextField
              select
              fullWidth
              label={label}
              name={name}
              value={value}
              onChange={onChange}
              error={!!error}
              helperText={helperText}
              required
              size={size}

          >
            {selectOptions.map((option) => (
              <MenuItem key={option.value} value={option.value}>
                {option.label}
              </MenuItem>
            ))} 
          </TextField>
      ) : (
        
        
          <TextField
            fullWidth
            name={name}
            label={label}
            value={value}
            onChange={onChange}
            error={!!error}
            helperText={helperText}
            type={type}
            required
            size={size}
          />
        )}
      
  

    </Grid>
  );
};

export default Input;
