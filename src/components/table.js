import React, { Component } from "react";
import "./table.css";

// Hvert API kall gir 100 resultater.
// Siden vi kun viser 20 om gangen lar vi state ha en offset variabel som går fra 0 til 4

var api_link = "https://api.github.com/search/repositories?q=language:javascript&sort=stars&order=desc&per_page=100&page=";
export default class CustomTable extends Component {
	constructor(props) {
		super(props);

		// Initial state
		this.state = {
			data: null,
			offset: 0,
			page: 1,
		};
	}

	changeOffset(newOffset) {
		this.setState({
			offset: newOffset,
		});
	}

	changePage(newPage) {
		fetch(api_link + newPage)
		.then(response => response.json())
		.then(data =>  {
			this.setState({
				data: data,
				offset: 0,
				page: newPage,
			});
		});
	}

	componentDidMount() {
		this.changePage(1);
	}

	render() {
		const render_data = [];
		const page_buttons = [];

		if (!this.state.data) return null;
		else {
			// Kalkuler offset for rendering, Vi viser 20 resultater om gangen.
			for (let i = this.state.offset * 20; i < (this.state.offset + 1) * 20; i++) {
				if (! this.state.data.items || ! this.state.data.items[i]) { // Fallback hvis det ikke er noe info
					render_data.push(
						<tr key={i.toString()}>
							<td>N/A</td>
							<td>N/A</td>
							<td>N/A</td>
							<td>N/A</td>
							<td>N/A</td>
						</tr>);
				} else {
					render_data.push(
						<tr key={i.toString()}>
							<td>{ 1 + i + (this.state.page - 1) * 100 }</td>
							<td>{this.state.data.items[i].name}</td>
							<td><a href={this.state.data.items[i].owner.html_url}>{this.state.data.items[i].owner.login}</a></td>
							<td><a href={this.state.data.items[i].html_url}>{this.state.data.items[i].html_url}</a></td>
							<td>{this.state.data.items[i].forks}</td>
						</tr>);
				}
			}

			// Lag knappene for å bla gjennom repoene.
			// Hvis det ikke er første side, lag en knapp for å gå bakover
			if (this.state.page > 1) {
				page_buttons.push(<button key={(this.state.page - 1) * 5} onClick={this.changePage.bind(this, this.state.page - 1)}>&lt;&lt;</button>)
			}
			// Lag 5 knapper for å bla gjennom sidene.
			for(let i = 0; i < 5; i++) {
				// Legg til "current_page" klassen og "disabled" attributten til knappen hvis det er siden vi er i nå.
				if (i === this.state.offset) {
					page_buttons.push(<button key={i} className="current_page" disabled onClick={this.changeOffset.bind(this, i)}>{ (this.state.page - 1) * 5 + i + 1 }</button>)
				} else {
					page_buttons.push(<button key={i} href="#" onClick={this.changeOffset.bind(this, i)}>{ (this.state.page - 1) * 5 + i + 1 }</button>)
				}
			}
			// Github APIet gir kun de første 1000 resultatene.
			// Siden en page har 100 resultater stopper vi å vise knappen for å gå videre etter page 10.
			if (this.state.page < 10) {
				page_buttons.push(<button key={this.state.page * 5} onClick={this.changePage.bind(this, this.state.page + 1)}>&gt;&gt;</button>)
			}
		}

		return (
			<div className="github_table_parent">
				<table className="github_table">
					<thead>
						<tr>
							<th>#</th>
							<th>Repo Navn</th>
							<th>Skaper</th>
							<th>Lenke</th>
							<th>Forks</th>
						</tr>
					</thead>
					<tbody>
						{render_data}
					</tbody>
				</table>
				<div className="page_buttons">
					{page_buttons}
				</div>
			</div>
		);
	}
}
