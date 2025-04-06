<script lang="ts">
	import Button from "./Button.svelte";
	import { playerId } from "$lib/stores/player.js";
	import type { Player } from "$lib/stores/firebase.js";
	import type { CreateDialog } from "./Dialog.svelte";
	import { getContext } from "svelte";
	import ChangeNameForm from "./ChangeNameForm.svelte";

	export let players: Player[];
	export let closeDialog;
	export let dialogId: number;
	
	const createDialog: CreateDialog = getContext('createDialog')

	function editName(player: Player) {
		if (player.id === $playerId) {
			createDialog({
				title: 'Choose your nickname',
				content: {
					component: ChangeNameForm,
					props: {
						player,
						changeName: (newName: string) => {
							const currentPlayerIndex = players.findIndex(player => player.id === $playerId);
							if (currentPlayerIndex !== undefined) players[currentPlayerIndex].nickname = newName;
						}
					}
				}
			})
		}
	}
</script>

<span class="text-center" style="padding: 0 32px;">Press on your nickname if you want to change it</span>
<div class="Players vertical-flex space hide-scroll">
	{#each players as player, index}
		<!-- svelte-ignore a11y_click_events_have_key_events -->
		<!-- svelte-ignore a11y_no_static_element_interactions -->
		<div
			class="Player space-between space-xl"
			class:active="{player.id === $playerId}"
			on:click="{() => editName(player)}"
		>
			<span>{index + 1}</span>
			<span style="flex: 1">{player.nickname}</span>
			<span>{player.score}</span>
		</div>
	{/each}
</div>
<Button label="Close leaderboard" on:click="{() => closeDialog(dialogId)}"/>

<style lang="scss">
	.Players {
		max-height: 10lh;
		overflow-y: auto;
		scroll-snap-type: y mandatory;

		.Player {
			height: 2lh;
			scroll-snap-align: start;
			padding: 8px;
			border-radius: 5px;
	
			&.active {
				background-color: rgba(19, 0, 22, 0.39);
			}
		}
	}
	
</style>