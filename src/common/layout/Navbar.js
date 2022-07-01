import React from "react";
import { Grid, Button, ButtonGroup, Typography } from "@mui/material";

const Navbar = () => {
		return (
		<nav className="Navbar">
      
			<Grid container spacing={3}>
			<Grid item xs={12} align="center">
				<Typography variant="h2" compact="h2">
					KLOTSKI!!
				</Typography>
			</Grid>
			<Grid item xs={12} align="center">
				<ButtonGroup
					disableElevation
					variant="contained"
					color="secondary"
					fullWidth={true}
				>
					<Button color="primary" href="/" >
						Home
					</Button>
					<Button color="secondary" href="/custom" >
          Custom Game
					</Button>
					<Button color="primary" href="/listgames" >
						List Games
					</Button>
          <Button color="secondary" href="/game/classic" >
            Classic Game
          </Button>
					{/* <Button color="primary" href="/random" >
						Random Game
					</Button> */}
				</ButtonGroup>
			</Grid>
			</Grid>
		</nav>
	);
};

export default Navbar;
