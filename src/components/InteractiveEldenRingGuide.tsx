'use client';

import React, { useState } from 'react';

type Quest = {
  id: string;
  text: string;
  details?: string;
};

type CompletedSteps = {
  [key: string]: boolean;
};

type MainQuests = {
  [key: string]: Quest[];
};

type OptionalQuests = {
  [key: string]: Quest[];
};

type DetailedQuests = {
  [key: string]: Quest[];
};

type BossInfo = {
  name: string;
  recommendedLevel: number;
  easyModeLevel: number;
  recommendedWeaponLevel: number;
  easyModeWeaponLevel: number;
  recommendedStats: {
    vigor: number;
    mind: number;
    endurance: number;
    strength: number;
    dexterity: number;
    intelligence: number;
    faith: number;
    arcane: number;
  };
  easyModeStats: {
    vigor: number;
    mind: number;
    endurance: number;
    strength: number;
    dexterity: number;
    intelligence: number;
    faith: number;
    arcane: number;
  };
  tips: string[];
  recommendedWeapons?: string[];
  recommendedAshes?: string[];
};

const InteractiveEldenRingGuide = () => {
  const [completedSteps, setCompletedSteps] = useState<CompletedSteps>({});
  const [activeSection, setActiveSection] = useState('limgrave');
  const [activeQuestlines, setActiveQuestlines] = useState<string[]>([]);
  const [showEndingInfo, setShowEndingInfo] = useState(false);
  const [expandedQuestline, setExpandedQuestline] = useState<string | null>(null);
  const [showBossInfo, setShowBossInfo] = useState<string | null>(null);
  const [bossInfoMode, setBossInfoMode] = useState<'balanced' | 'easy'>('balanced');
  const [showQuestDetails, setShowQuestDetails] = useState<string | null>(null);
  const [activeDetailedQuests, setActiveDetailedQuests] = useState<string[]>([]);
  const [expandedDetailedQuest, setExpandedDetailedQuest] = useState<string | null>(null);

  const mainQuests: MainQuests = {
    limgrave: [
      { id: 'margit', text: 'Defeat Margit, the Fell Omen at Stormveil Castle entrance' },
      { id: 'godrick', text: 'Defeat Godrick the Grafted at the end of Stormveil Castle' },
      { id: 'roundtable', text: 'Visit Roundtable Hold (happens automatically after some progression)' },
      { id: 'godrick_rune', text: 'Activate Godrick\'s Great Rune at the Divine Tower of Limgrave' },
    ],
    liurnia: [
      { id: 'rennala', text: 'Defeat Rennala, Queen of the Full Moon at the Academy of Raya Lucaria' },
    ],
    mid_game: [
      { id: 'second_rune', text: 'Obtain a second Great Rune (either Radahn, Rykard, or you already have Rennala\'s)' },
    ],
    leyndell: [
      { id: 'morgott', text: 'Defeat Morgott, the Omen King at Leyndell Royal Capital' },
    ],
    mountaintops: [
      { id: 'fire_giant', text: 'Defeat Fire Giant at the Mountaintops of the Giants' },
      { id: 'erdtree_burning', text: 'Complete the Erdtree Burning ceremony at the Forge of the Giants' },
    ],
    farum_azula: [
      { id: 'godskin_duo', text: 'Defeat Godskin Duo in Crumbling Farum Azula' },
      { id: 'maliketh', text: 'Defeat Maliketh, the Black Blade in Crumbling Farum Azula' },
    ],
    ashen_capital: [
      { id: 'godfrey', text: 'Defeat Godfrey, First Elden Lord/Hoarah Loux, Warrior in Leyndell, Ashen Capital' },
      { id: 'final_boss', text: 'Defeat the Final Boss' },
    ]
  };

  // Add detailed quest steps for main quest items that need more explanation
  const detailedQuests: DetailedQuests = {
    godrick_rune: [
      { id: 'find_tower_entrance', text: 'Find the bridge to Divine Tower of Limgrave (east of Liftside Chamber site of grace in Stormveil Castle)' },
      { id: 'cross_bridge', text: 'Cross the bridge to reach the Divine Tower of Limgrave' },
      { id: 'climb_tower', text: 'Climb the tower using the lifts and ladders' },
      { id: 'activate_rune', text: 'Interact with the dead finger at the top to activate Godrick\'s Great Rune' },
    ],
    second_rune: [
      { id: 'choose_path', text: 'Choose which Great Rune to pursue (Rennala, Radahn, or Rykard)' },
      { id: 'rennala_path', text: 'For Rennala: Defeat her at the Academy of Raya Lucaria (no activation needed)' },
      { id: 'radahn_path', text: 'For Radahn: Defeat him at Redmane Castle in Caelid' },
      { id: 'radahn_tower', text: 'For Radahn: Activate his Great Rune at the Divine Tower of Caelid' },
      { id: 'rykard_path', text: 'For Rykard: Defeat him at Volcano Manor in Mt. Gelmir' },
      { id: 'rykard_tower', text: 'For Rykard: Activate his Great Rune at the Divine Tower of West Altus' },
    ],
    erdtree_burning: [
      { id: 'reach_forge', text: 'Reach the Forge of the Giants site of grace after defeating Fire Giant' },
      { id: 'talk_melina', text: 'Rest at the site of grace and select "Talk to Melina" when prompted' },
      { id: 'confirm_burning', text: 'Confirm your decision to burn the Erdtree (point of no return for some quests)' },
    ],
    godfrey: [
      { id: 'reach_godfrey', text: 'Reach Godfrey\'s boss arena in Leyndell, Ashen Capital' },
      { id: 'defeat_phase1', text: 'Defeat Godfrey, First Elden Lord (phase 1)' },
      { id: 'defeat_phase2', text: 'Defeat Hoarah Loux, Warrior (phase 2)' },
    ],
  };

  const optionalQuests: OptionalQuests = {
    ranni: [
      { id: 'caria_manor', text: 'Complete Caria Manor in northwest Liurnia' },
      { id: 'meet_ranni', text: 'Meet Ranni at Ranni\'s Rise in Three Sisters (north of Caria Manor)' },
      { id: 'ranni_servants', text: 'Speak to her servants: Iji, Blaidd, and Seluvis' },
      { id: 'radahn', text: 'Travel to Caelid and defeat Starscourge Radahn at Redmane Castle Festival' },
      { id: 'nokron', text: 'Enter Nokron, Eternal City through the crater created after defeating Radahn' },
      { id: 'fingerslayer', text: 'Find and obtain the Fingerslayer Blade from Nokron (in a chest past Mimic Tear boss)' },
      { id: 'return_blade', text: 'Return the Fingerslayer Blade to Ranni' },
      { id: 'rennas_rise', text: 'Travel to Renna\'s Rise (newly accessible tower) and use the teleporter' },
      { id: 'ainsel_river', text: 'Progress through Ainsel River Main and Lake of Rot' },
      { id: 'astel', text: 'Defeat Astel, Naturalborn of the Void' },
      { id: 'moonlight_altar', text: 'Proceed to the Moonlight Altar and find the Cathedral of Manus Celes' },
      { id: 'ranni_doll', text: 'Find Ranni\'s miniature doll body and talk to it' },
      { id: 'ranni_ending', text: 'After defeating the final boss, summon Ranni (blue summon sign will appear)' },
    ],
    frenzied: [
      { id: 'shunning_grounds', text: 'In Leyndell, reach the Subterranean Shunning-Grounds (entrance behind a stonesword key fog near the Avenue Balcony Site of Grace)' },
      { id: 'mohg_omen', text: 'Progress through the sewers, past the Mohg, the Omen boss fight' },
      { id: 'hidden_path', text: 'Attack the altar behind Mohg to reveal a hidden path' },
      { id: 'platforming', text: 'Descend to the bottom of the platforming section' },
      { id: 'naked', text: 'Remove all armor and weapons (completely naked)' },
      { id: 'three_fingers', text: 'Interact with the door to be embraced by the Three Fingers' },
      { id: 'frenzied_ending', text: 'After defeating the final boss, the Frenzied Flame ending will trigger automatically' },
    ],
    fia: [
      { id: 'meet_fia', text: 'Meet Fia at Roundtable Hold and receive her embrace' },
      { id: 'talk_d', text: 'Talk to D, Hunter of the Dead about Deathroot' },
      { id: 'find_deathroot', text: 'Find at least one Deathroot and give it to Gurranq in Bestial Sanctum' },
      { id: 'deeproot_depths', text: 'Reach Deeproot Depths (via coffin in Siofra Aqueduct after defeating Valiant Gargoyles)' },
      { id: 'fia_deeproot', text: 'Find Fia in Deeproot Depths' },
      { id: 'give_weathered', text: 'Give Fia the Weathered Dagger (obtained from Rogier after his questline)' },
      { id: 'dream_fia', text: 'Enter Fia\'s dream by talking to her while she sleeps' },
      { id: 'defeat_fortissax', text: 'Defeat Lichdragon Fortissax in the dream' },
      { id: 'mending_rune_death', text: 'Obtain the Mending Rune of the Death-Prince from Fia' },
      { id: 'fia_ending', text: 'After defeating the final boss, use the Mending Rune of the Death-Prince' },
    ],
    dung_eater: [
      { id: 'find_seedbed', text: 'Find a Seedbed Curse (first one available in Leyndell)' },
      { id: 'meet_dung_eater', text: 'Meet the Dung Eater at Roundtable Hold after finding a Seedbed Curse' },
      { id: 'find_corpse', text: 'Find Dung Eater\'s corpse in the Subterranean Shunning-Grounds and give him the Seedbed Curse' },
      { id: 'free_dung_eater', text: 'Free the real Dung Eater from the Sewers using the Sewer-Gaol Key' },
      { id: 'collect_seedbeds', text: 'Collect all 5 Seedbed Curses and give them to Dung Eater' },
      { id: 'defeat_dung_eater', text: 'Defeat Dung Eater invader at the Outer Moat in Leyndell' },
      { id: 'mending_rune_curse', text: 'Obtain the Mending Rune of the Fell Curse' },
      { id: 'dung_eater_ending', text: 'After defeating the final boss, use the Mending Rune of the Fell Curse' },
    ],
    goldmask: [
      { id: 'meet_goldmask', text: 'Meet Goldmask and Brother Corhyn on the broken bridge in Altus Plateau' },
      { id: 'leyndell_puzzle', text: 'Help Goldmask solve the puzzle in Leyndell (requires Intelligence 37)' },
      { id: 'mountaintops_goldmask', text: 'Find Goldmask in the Mountaintops of the Giants' },
      { id: 'ashen_goldmask', text: 'Find Goldmask in Leyndell, Ashen Capital' },
      { id: 'mending_rune_order', text: 'Obtain the Mending Rune of Perfect Order from Goldmask\'s corpse' },
      { id: 'goldmask_ending', text: 'After defeating the final boss, use the Mending Rune of Perfect Order' },
    ]
  };

  // Update boss information data
  const bossInfoData: Record<string, BossInfo> = {
    margit: {
      name: "Margit, the Fell Omen",
      recommendedLevel: 25,
      easyModeLevel: 35,
      recommendedWeaponLevel: 2,
      easyModeWeaponLevel: 4,
      recommendedStats: {
        vigor: 20,
        mind: 10,
        endurance: 15,
        strength: 16,
        dexterity: 18,
        intelligence: 9,
        faith: 12,
        arcane: 7
      },
      easyModeStats: {
        vigor: 25,
        mind: 12,
        endurance: 18,
        strength: 18,
        dexterity: 20,
        intelligence: 9,
        faith: 14,
        arcane: 7
      },
      tips: [
        "Use Spirit Ashes to distract Margit",
        "Margit is weak to bleed damage, which your Flamberge naturally causes",
        "Purchase Margit's Shackle from Patches to stun him twice during the fight",
        "Roll towards his attacks rather than away from them",
        "Use Flaming Strike to add fire damage and create distance when needed"
      ],
      recommendedWeapons: ["Flamberge", "Lordsworn's Greatsword", "Claymore"],
      recommendedAshes: ["Flaming Strike", "Determination", "Wild Strikes"]
    },
    godrick: {
      name: "Godrick the Grafted",
      recommendedLevel: 35,
      easyModeLevel: 45,
      recommendedWeaponLevel: 3,
      easyModeWeaponLevel: 6,
      recommendedStats: {
        vigor: 25,
        mind: 12,
        endurance: 18,
        strength: 18,
        dexterity: 20,
        intelligence: 9,
        faith: 14,
        arcane: 7
      },
      easyModeStats: {
        vigor: 30,
        mind: 14,
        endurance: 20,
        strength: 20,
        dexterity: 22,
        intelligence: 9,
        faith: 16,
        arcane: 7
      },
      tips: [
        "Stay close to his legs in phase 1",
        "In phase 2, roll to the side when he uses his fire breath",
        "Summon Nepheli Loux if you've progressed her questline",
        "Godrick is weak to bleed, making your Flamberge effective",
        "Use Flaming Strike for extra fire damage and mobility"
      ],
      recommendedWeapons: ["Flamberge", "Lordsworn's Greatsword", "Claymore"],
      recommendedAshes: ["Flaming Strike", "Determination", "Stamp (Upward Cut)"]
    },
    rennala: {
      name: "Rennala, Queen of the Full Moon",
      recommendedLevel: 50,
      easyModeLevel: 60,
      recommendedWeaponLevel: 6,
      easyModeWeaponLevel: 8,
      recommendedStats: {
        vigor: 30,
        mind: 12,
        endurance: 20,
        strength: 20,
        dexterity: 22,
        intelligence: 9,
        faith: 16,
        arcane: 7
      },
      easyModeStats: {
        vigor: 35,
        mind: 14,
        endurance: 22,
        strength: 22,
        dexterity: 25,
        intelligence: 9,
        faith: 18,
        arcane: 7
      },
      tips: [
        "In phase 1, target the singing students with the golden aura",
        "In phase 2, close distance quickly as she's weak in melee combat",
        "Summon your spirit ashes at the start of phase 2",
        "She's weak to physical and fire damage, making your Flamberge with Flaming Strike ideal",
        "Use the follow-up attack of Flaming Strike to close distance quickly"
      ],
      recommendedWeapons: ["Flamberge", "Claymore", "Greatsword"],
      recommendedAshes: ["Flaming Strike", "Stamp (Upward Cut)", "Lion's Claw"]
    },
    radahn: {
      name: "Starscourge Radahn",
      recommendedLevel: 70,
      easyModeLevel: 85,
      recommendedWeaponLevel: 12,
      easyModeWeaponLevel: 15,
      recommendedStats: {
        vigor: 35,
        mind: 12,
        endurance: 25,
        strength: 22,
        dexterity: 25,
        intelligence: 9,
        faith: 18,
        arcane: 7
      },
      easyModeStats: {
        vigor: 40,
        mind: 14,
        endurance: 28,
        strength: 25,
        dexterity: 30,
        intelligence: 9,
        faith: 20,
        arcane: 7
      },
      tips: [
        "Summon all available NPCs and resummon them when they die",
        "Use Torrent to close distance and avoid his ranged attacks",
        "Dismount when attacking to avoid being knocked off",
        "In phase 2, watch for his meteor attack and run perpendicular to it",
        "Flaming Strike's follow-up attack is great for closing distance after his attacks"
      ],
      recommendedWeapons: ["Flamberge", "Greatsword", "Starscourge Greatsword (if you have it)"],
      recommendedAshes: ["Flaming Strike", "Lion's Claw", "Bloodhound's Step"]
    },
    morgott: {
      name: "Morgott, the Omen King",
      recommendedLevel: 80,
      easyModeLevel: 100,
      recommendedWeaponLevel: 15,
      easyModeWeaponLevel: 18,
      recommendedStats: {
        vigor: 40,
        mind: 15,
        endurance: 25,
        strength: 25,
        dexterity: 30,
        intelligence: 9,
        faith: 20,
        arcane: 7
      },
      easyModeStats: {
        vigor: 45,
        mind: 18,
        endurance: 30,
        strength: 28,
        dexterity: 35,
        intelligence: 9,
        faith: 22,
        arcane: 7
      },
      tips: [
        "Summon Melina if you've progressed the story",
        "Use a 100% physical block shield to mitigate damage",
        "Jump over his sweeping attacks for jump attack opportunities",
        "Watch for his holy daggers and roll through them",
        "Morgott is weak to bleed, making your Flamberge effective"
      ],
      recommendedWeapons: ["Flamberge", "Blasphemous Blade (if you have it)", "Ruins Greatsword"],
      recommendedAshes: ["Flaming Strike", "Lion's Claw", "Giant Hunt"]
    },
    fire_giant: {
      name: "Fire Giant",
      recommendedLevel: 100,
      easyModeLevel: 120,
      recommendedWeaponLevel: 18,
      easyModeWeaponLevel: 22,
      recommendedStats: {
        vigor: 45,
        mind: 15,
        endurance: 30,
        strength: 28,
        dexterity: 35,
        intelligence: 9,
        faith: 22,
        arcane: 7
      },
      easyModeStats: {
        vigor: 50,
        mind: 18,
        endurance: 35,
        strength: 30,
        dexterity: 40,
        intelligence: 9,
        faith: 25,
        arcane: 7
      },
      tips: [
        "Stay on Torrent for mobility but dismount to attack",
        "Target his left ankle (with the brace) in phase 1",
        "In phase 2, stay behind him and watch for rolling attacks",
        "Note: Fire Giant is resistant to fire, so your Flaming Strike will be less effective",
        "Consider temporarily switching to a different Ash of War like Bloodhound's Step"
      ],
      recommendedWeapons: ["Flamberge (with non-fire Ash of War)", "Ruins Greatsword", "Blasphemous Blade"],
      recommendedAshes: ["Bloodhound's Step", "Lion's Claw", "Giant Hunt"]
    },
    godskin_duo: {
      name: "Godskin Duo",
      recommendedLevel: 120,
      easyModeLevel: 140,
      recommendedWeaponLevel: 20,
      easyModeWeaponLevel: 24,
      recommendedStats: {
        vigor: 50,
        mind: 15,
        endurance: 30,
        strength: 30,
        dexterity: 40,
        intelligence: 9,
        faith: 25,
        arcane: 7
      },
      easyModeStats: {
        vigor: 55,
        mind: 18,
        endurance: 35,
        strength: 35,
        dexterity: 45,
        intelligence: 9,
        faith: 28,
        arcane: 7
      },
      tips: [
        "Use sleep pots or sleep arrows to temporarily disable one of them",
        "Focus on killing one at a time rather than damaging both equally",
        "Use the pillars to separate them and block attacks",
        "A strong spirit ash like Mimic Tear can help manage the fight",
        "Both are weak to bleed, making your Flamberge effective"
      ],
      recommendedWeapons: ["Flamberge", "Blasphemous Blade", "Dark Moon Greatsword (if you have it)"],
      recommendedAshes: ["Flaming Strike", "Bloodhound's Step", "Lion's Claw"]
    },
    maliketh: {
      name: "Maliketh, the Black Blade",
      recommendedLevel: 130,
      easyModeLevel: 150,
      recommendedWeaponLevel: 22,
      easyModeWeaponLevel: 25,
      recommendedStats: {
        vigor: 55,
        mind: 15,
        endurance: 30,
        strength: 35,
        dexterity: 45,
        intelligence: 9,
        faith: 28,
        arcane: 7
      },
      easyModeStats: {
        vigor: 60,
        mind: 18,
        endurance: 35,
        strength: 40,
        dexterity: 50,
        intelligence: 9,
        faith: 30,
        arcane: 7
      },
      tips: [
        "Use the Blasphemous Claw item to parry his glowing attacks",
        "Stay close to him in phase 2 as his ranged attacks are deadly",
        "Roll towards him rather than away to avoid his combos",
        "His attacks reduce your max HP, so healing is crucial",
        "Flaming Strike's follow-up attack helps close distance after dodging"
      ],
      recommendedWeapons: ["Flamberge", "Blasphemous Blade", "Ruins Greatsword"],
      recommendedAshes: ["Flaming Strike", "Bloodhound's Step", "Lion's Claw"]
    },
    godfrey: {
      name: "Godfrey, First Elden Lord/Hoarah Loux",
      recommendedLevel: 140,
      easyModeLevel: 160,
      recommendedWeaponLevel: 24,
      easyModeWeaponLevel: 25,
      recommendedStats: {
        vigor: 60,
        mind: 15,
        endurance: 35,
        strength: 40,
        dexterity: 50,
        intelligence: 9,
        faith: 30,
        arcane: 7
      },
      easyModeStats: {
        vigor: 65,
        mind: 18,
        endurance: 40,
        strength: 45,
        dexterity: 55,
        intelligence: 9,
        faith: 35,
        arcane: 7
      },
      tips: [
        "In phase 1, watch for his stomps which create shockwaves",
        "In phase 2, his grab attacks are deadly - roll away when he reaches for you",
        "Jump over his shockwave attacks for jump attack opportunities",
        "Keep medium distance to bait his leaping attacks which leave him vulnerable",
        "Flaming Strike's initial attack is good for creating space in phase 2"
      ],
      recommendedWeapons: ["Flamberge", "Ruins Greatsword", "Blasphemous Blade"],
      recommendedAshes: ["Flaming Strike", "Lion's Claw", "Giant Hunt"]
    },
    final_boss: {
      name: "Final Boss",
      recommendedLevel: 150,
      easyModeLevel: 170,
      recommendedWeaponLevel: 25,
      easyModeWeaponLevel: 25,
      recommendedStats: {
        vigor: 60,
        mind: 15,
        endurance: 35,
        strength: 40,
        dexterity: 50,
        intelligence: 9,
        faith: 30,
        arcane: 7
      },
      easyModeStats: {
        vigor: 70,
        mind: 20,
        endurance: 40,
        strength: 45,
        dexterity: 60,
        intelligence: 9,
        faith: 35,
        arcane: 7
      },
      tips: [
        "Use Holy damage negation items and armor",
        "Jump over the ring attacks in phase 1",
        "In phase 2, roll towards the boss to avoid the tracking attacks",
        "Save your spirit summon for phase 2",
        "Be patient and don't get greedy with attacks",
        "Flaming Strike is effective, but consider Black Flame for more Holy damage negation"
      ],
      recommendedWeapons: ["Flamberge", "Blasphemous Blade", "Ruins Greatsword"],
      recommendedAshes: ["Flaming Strike", "Bloodhound's Step", "Black Flame Tornado"]
    }
  };

  const isStepComplete = (section: string, id: string) => completedSteps[`${section}_${id}`];

  const toggleStep = (section: string, id: string) => {
    setCompletedSteps(prev => {
      const newCompletedSteps = { ...prev };
      const stepKey = `${section}_${id}`;
      const newValue = !prev[stepKey];
      newCompletedSteps[stepKey] = newValue;
      
      // If this is a main quest step being completed
      if (section === 'mainQuests' && newValue) {
        // Check if this quest has detailed steps
        if (detailedQuests[id]) {
          // Mark all detailed steps as complete
          detailedQuests[id].forEach(step => {
            newCompletedSteps[`${id}_${step.id}`] = true;
          });
        }
      }
      // If this is a main quest step being uncompleted
      else if (section === 'mainQuests' && !newValue) {
        // Check if this quest has detailed steps
        if (detailedQuests[id]) {
          // Mark all detailed steps as incomplete
          detailedQuests[id].forEach(step => {
            newCompletedSteps[`${id}_${step.id}`] = false;
          });
        }
      }
      
      // If this is a detailed step being toggled
      if (section !== 'mainQuests' && detailedQuests[section]) {
        if (newValue) {
          // If a detailed step is being checked, check if all detailed steps are now complete
          const allDetailedStepsComplete = detailedQuests[section].every(
            step => step.id === id ? newValue : newCompletedSteps[`${section}_${step.id}`]
          );
          
          // If all detailed steps are complete, mark the main quest as complete
          if (allDetailedStepsComplete) {
            newCompletedSteps[`mainQuests_${section}`] = true;
          }
        } else {
          // If a detailed step is being unchecked, always uncheck the main quest
          newCompletedSteps[`mainQuests_${section}`] = false;
        }
      }
      
      return newCompletedSteps;
    });
  };

  const allSectionComplete = (section: string) => {
    return mainQuests[section].every(quest => {
      // If the main quest step is completed, return true
      if (completedSteps[`mainQuests_${quest.id}`]) {
        return true;
      }
      
      // If this quest has detailed steps and is active, check if all detailed steps are complete
      if (isDetailedQuestActive(quest.id) && detailedQuests[quest.id]) {
        return detailedQuests[quest.id].every(step => completedSteps[`${quest.id}_${step.id}`]);
      }
      
      // Otherwise, the quest is not complete
      return false;
    });
  };

  const areAllPrerequisitesComplete = (section: string) => {
    switch (section) {
      case 'limgrave':
        return true;
      case 'liurnia':
        return allSectionComplete('limgrave');
      case 'mid_game':
        return allSectionComplete('liurnia');
      case 'leyndell':
        return allSectionComplete('mid_game');
      case 'mountaintops':
        return allSectionComplete('leyndell');
      case 'farum_azula':
        return allSectionComplete('mountaintops');
      case 'ashen_capital':
        return allSectionComplete('farum_azula');
      default:
        return false;
    }
  };

  const isEndingPathComplete = (path: string) => {
    return optionalQuests[path].every(quest => completedSteps[`${path}_${quest.id}`]);
  };

  const sectionsData = [
    { id: 'limgrave', name: 'Limgrave' },
    { id: 'liurnia', name: 'Liurnia of the Lakes' },
    { id: 'mid_game', name: 'Altus Plateau/Caelid' },
    { id: 'leyndell', name: 'Leyndell, Royal Capital' },
    { id: 'mountaintops', name: 'Mountaintops of the Giants' },
    { id: 'farum_azula', name: 'Crumbling Farum Azula' },
    { id: 'ashen_capital', name: 'Leyndell, Ashen Capital' },
  ];

  const isQuestlineActive = (questline: string) => activeQuestlines.includes(questline);

  const toggleQuestline = (questline: string) => {
    if (isQuestlineActive(questline)) {
      setActiveQuestlines(prev => prev.filter(q => q !== questline));
      if (expandedQuestline === questline) {
        setExpandedQuestline(null);
      }
    } else {
      const conflict = checkEndingConflicts(questline);
      if (conflict.hasConflict) {
        if (window.confirm(conflict.message + "\n\nDo you still want to pursue this questline?")) {
          setActiveQuestlines(prev => [...prev, questline]);
          setExpandedQuestline(questline);
        }
      } else {
        setActiveQuestlines(prev => [...prev, questline]);
        setExpandedQuestline(questline);
      }
    }
  };

  const getNextStepMessage = () => {
    // First check main quests
    for (const section of sectionsData) {
      if (!allSectionComplete(section.id)) {
        const nextStep = mainQuests[section.id].find(quest => !completedSteps[`mainQuests_${quest.id}`]);
        if (nextStep) {
          // Check if this quest has detailed steps and is active
          if (isDetailedQuestActive(nextStep.id)) {
            const nextDetailedStep = detailedQuests[nextStep.id]?.find(step => !completedSteps[`${nextStep.id}_${step.id}`]);
            if (nextDetailedStep) {
              return `Next step: ${nextDetailedStep.text} (part of ${nextStep.text})`;
            }
          }
          return `Next main quest step: ${nextStep.text} in ${section.name}`;
        }
      }
    }
    
    // Check all active questlines for next steps
    for (const questline of activeQuestlines) {
      if (!isEndingPathComplete(questline)) {
        const nextStep = optionalQuests[questline].find(quest => !completedSteps[`${questline}_${quest.id}`]);
        if (nextStep) {
          const endingNames: {[key: string]: string} = {
            'ranni': 'Age of Stars',
            'frenzied': 'Lord of Frenzied Flame',
            'fia': 'Age of Duskborn',
            'dung_eater': 'Blessing of Despair',
            'goldmask': 'Age of Order'
          };
          return nextStep ? `Next step for ${endingNames[questline]} ending: ${nextStep.text}` : '';
        }
      }
    }
    
    if (completedSteps['mainQuests_final_boss']) {
      return 'You have completed the main quest! Choose your ending.';
    }
    
    return 'Continue with the main quest.';
  };

  const renderMainQuests = (section: string) => {
    return mainQuests[section].map(quest => {
      // Check if this quest is a boss fight
      const isBoss = ['margit', 'godrick', 'rennala', 'radahn', 'morgott', 'fire_giant', 'godskin_duo', 'maliketh', 'godfrey', 'final_boss'].includes(quest.id);
      const hasDetailedSteps = !!detailedQuests[quest.id];
      
      // Get boss info for level display if this is a boss
      const bossInfo = isBoss ? bossInfoData[quest.id] : null;
      
      return (
        <div key={quest.id} className="p-2 border-b border-gray-200 hover:bg-gray-50">
          <div className="flex items-start gap-2">
            <label className="flex items-start gap-2 cursor-pointer flex-1">
              <input
                type="checkbox"
                checked={completedSteps[`mainQuests_${quest.id}`] || false}
                onChange={() => toggleStep('mainQuests', quest.id)}
                className="mt-1"
              />
              <span className={completedSteps[`mainQuests_${quest.id}`] ? "line-through text-gray-500" : ""}>
                {quest.text}
                {isBoss && bossInfo && (
                  <span className="ml-2 text-xs inline-flex items-center">
                    <span className="bg-amber-100 text-amber-800 px-2 py-0.5 rounded mr-1" title="Recommended level">
                      Lvl {bossInfo.recommendedLevel}-{bossInfo.easyModeLevel}
                    </span>
                    <span className="bg-blue-100 text-blue-800 px-2 py-0.5 rounded" title="Recommended weapon level">
                      Wep +{bossInfo.recommendedWeaponLevel}-{bossInfo.easyModeWeaponLevel}
                    </span>
                  </span>
                )}
              </span>
            </label>
            <div className="flex gap-2">
              {hasDetailedSteps && (
                <button 
                  onClick={() => toggleDetailedQuest(quest.id)}
                  className={`px-2 py-1 text-xs ${isDetailedQuestActive(quest.id) ? 'bg-blue-600 text-white' : 'bg-blue-100 text-blue-800'} rounded hover:bg-blue-200`}
                  title="View detailed steps"
                >
                  {isDetailedQuestActive(quest.id) ? 'Hide Steps' : 'Show Steps'}
                </button>
              )}
              {isBoss && (
                <button 
                  onClick={() => setShowBossInfo(quest.id)}
                  className="px-2 py-1 text-xs bg-amber-100 text-amber-800 rounded hover:bg-amber-200"
                  title="View boss information"
                >
                  Boss Info
                </button>
              )}
            </div>
          </div>
          {isDetailedQuestActive(quest.id) && expandedDetailedQuest === quest.id && (
            <div className="ml-6 mt-2 bg-blue-50 p-3 rounded border border-blue-100">
              <h4 className="font-medium text-blue-800 mb-2">Detailed Steps:</h4>
              {detailedQuests[quest.id].map(step => (
                <div key={step.id} className="ml-2 mb-2">
                  <label className="flex items-start gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={completedSteps[`${quest.id}_${step.id}`] || false}
                      onChange={() => toggleStep(quest.id, step.id)}
                      className="mt-1"
                    />
                    <span className={completedSteps[`${quest.id}_${step.id}`] ? "line-through text-gray-500" : ""}>
                      {step.text}
                    </span>
                  </label>
                </div>
              ))}
            </div>
          )}
        </div>
      );
    });
  };

  const renderEndingQuests = (path: string) => {
    return optionalQuests[path].map(quest => (
      <div key={quest.id} className="p-2 border-b border-gray-200 hover:bg-gray-50">
        <label className="flex items-start gap-2 cursor-pointer">
          <input
            type="checkbox"
            checked={completedSteps[`${path}_${quest.id}`] || false}
            onChange={() => toggleStep(path, quest.id)}
            className="mt-1"
          />
          <span className={completedSteps[`${path}_${quest.id}`] ? "line-through text-gray-500" : ""}>
            {quest.text}
          </span>
        </label>
      </div>
    ));
  };

  const renderDecisionPoints = () => {
    if (completedSteps['mainQuests_godrick'] && !completedSteps['mainQuests_second_rune']) {
      return (
        <div className="bg-blue-50 p-3 my-4 rounded-md border border-blue-200">
          <h3 className="font-bold text-blue-700">Decision Point</h3>
          <p className="text-blue-700">Now is a good time to start optional questlines for alternative endings.</p>
          <div className="flex flex-wrap gap-2 mt-2">
            <button 
              onClick={() => toggleQuestline('ranni')}
              className={`px-4 py-2 ${isQuestlineActive('ranni') ? 'bg-blue-800' : 'bg-blue-600'} text-white rounded hover:bg-blue-700`}
            >
              {isQuestlineActive('ranni') ? 'Ranni\'s Questline (Active)' : 'Start Ranni\'s Questline'}
            </button>
            <button 
              onClick={() => toggleQuestline('fia')}
              className={`px-4 py-2 ${isQuestlineActive('fia') ? 'bg-indigo-800' : 'bg-indigo-600'} text-white rounded hover:bg-indigo-700`}
            >
              {isQuestlineActive('fia') ? 'Fia\'s Questline (Active)' : 'Start Fia\'s Questline'}
            </button>
          </div>
        </div>
      );
    }
    
    if (completedSteps['mainQuests_second_rune'] && !completedSteps['mainQuests_morgott']) {
      return (
        <div className="bg-yellow-50 p-3 my-4 rounded-md border border-yellow-200">
          <h3 className="font-bold text-yellow-700">Decision Point</h3>
          <p className="text-yellow-700">Now that you've reached Altus Plateau, you can start Goldmask's questline for the Age of Order ending.</p>
          <button 
            onClick={() => toggleQuestline('goldmask')}
            className={`mt-2 px-4 py-2 ${isQuestlineActive('goldmask') ? 'bg-yellow-800' : 'bg-yellow-600'} text-white rounded hover:bg-yellow-700`}
          >
            {isQuestlineActive('goldmask') ? 'Goldmask&apos;s Questline (Active)' : 'Start Goldmask&apos;s Questline'}
          </button>
        </div>
      );
    }
    
    if (completedSteps['mainQuests_morgott'] && !completedSteps['mainQuests_fire_giant']) {
      return (
        <div className="bg-red-50 p-3 my-4 rounded-md border border-red-200">
          <h3 className="font-bold text-red-700">Decision Point</h3>
          <p className="text-red-700">Now that you&apos;ve reached Leyndell, you can start the Dung Eater&apos;s questline for the Blessing of Despair ending.</p>
          <button 
            onClick={() => toggleQuestline('dung_eater')}
            className={`mt-2 px-4 py-2 ${isQuestlineActive('dung_eater') ? 'bg-red-800' : 'bg-red-600'} text-white rounded hover:bg-red-700`}
          >
            {isQuestlineActive('dung_eater') ? 'Dung Eater&apos;s Questline (Active)' : 'Start Dung Eater&apos;s Questline'}
          </button>
        </div>
      );
    }
    
    if (completedSteps['mainQuests_fire_giant'] && !completedSteps['mainQuests_erdtree_burning']) {
      return (
        <div className="bg-orange-50 p-3 my-4 rounded-md border border-orange-200">
          <h3 className="font-bold text-orange-700">Important Decision Point</h3>
          <p className="text-orange-700 font-bold mt-1">Warning: This will lock you into this ending unless you complete Millicent&apos;s questline and use Miquella&apos;s Needle.</p>
          <button 
            onClick={() => toggleQuestline('frenzied')}
            className={`mt-2 px-4 py-2 ${isQuestlineActive('frenzied') ? 'bg-orange-800' : 'bg-orange-600'} text-white rounded hover:bg-orange-700`}
          >
            {isQuestlineActive('frenzied') ? 'Frenzied Flame Questline (Active)' : 'Pursue Frenzied Flame Ending'}
          </button>
        </div>
      );
    }
    
    if (completedSteps['mainQuests_final_boss']) {
      return (
        <div className="bg-green-50 p-3 my-4 rounded-md border border-green-200">
          <h3 className="font-bold text-green-700">Game Complete!</h3>
          <p className="text-green-700">You&apos;ve defeated the final boss. Choose your ending:</p>
          <div className="flex flex-wrap gap-2 mt-2">
            <button 
              onClick={() => setShowEndingInfo(true)}
              className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
            >
              View Available Endings
            </button>
          </div>
        </div>
      );
    }
    
    return null;
  };

  const renderEndingAvailability = () => {
    if (!showEndingInfo) return null;
    
    const standardAvailable = completedSteps['mainQuests_final_boss'];
    const ranniAvailable = standardAvailable && isEndingPathComplete('ranni');
    const frenziedAvailable = standardAvailable && completedSteps['frenzied_three_fingers'];
    const fiaAvailable = standardAvailable && completedSteps['fia_mending_rune_death'];
    const dungEaterAvailable = standardAvailable && completedSteps['dung_eater_mending_rune_curse'];
    const goldmaskAvailable = standardAvailable && completedSteps['goldmask_mending_rune_order'];
    
    return (
      <div className="bg-purple-50 p-4 my-4 rounded-md border border-purple-200">
        <h3 className="font-bold text-purple-900 text-lg mb-3">Available Endings</h3>
        
        <div className="mb-3 pb-3 border-b border-purple-200">
          <div className="flex items-center">
            <div className={`w-3 h-3 rounded-full mr-2 ${standardAvailable ? "bg-green-500" : "bg-red-500"}`}></div>
            <h4 className="font-semibold">Elden Lord (Standard Ending)</h4>
          </div>
          <p className="text-sm ml-5 mt-1">{standardAvailable ? 
            "Available: Simply interact with the fractured Marika after defeating the final boss." : 
            "Complete the main questline to unlock this ending."}</p>
        </div>
        
        <div className="mb-3 pb-3 border-b border-purple-200">
          <div className="flex items-center">
            <div className={`w-3 h-3 rounded-full mr-2 ${ranniAvailable ? "bg-green-500" : "bg-red-500"}`}></div>
            <h4 className="font-semibold">Age of Stars (Ranni&apos;s Ending)</h4>
          </div>
          <p className="text-sm ml-5 mt-1">{ranniAvailable ? 
            "Available: Look for Ranni&apos;s blue summon sign after defeating the final boss." : 
            isQuestlineActive('ranni') ? "Continue Ranni&apos;s questline to unlock this ending." : 
            "You need to complete Ranni&apos;s questline to unlock this ending."}</p>
        </div>
        
        <div className="mb-3 pb-3 border-b border-purple-200">
          <div className="flex items-center">
            <div className={`w-3 h-3 rounded-full mr-2 ${fiaAvailable ? "bg-green-500" : "bg-red-500"}`}></div>
            <h4 className="font-semibold">Age of Duskborn (Fia&apos;s Ending)</h4>
          </div>
          <p className="text-sm ml-5 mt-1">{fiaAvailable ? 
            "Available: Use the Mending Rune of the Death-Prince after defeating the final boss." : 
            isQuestlineActive('fia') ? "Continue Fia&apos;s questline to unlock this ending." : 
            "You need to complete Fia&apos;s questline to unlock this ending."}</p>
        </div>
        
        <div className="mb-3 pb-3 border-b border-purple-200">
          <div className="flex items-center">
            <div className={`w-3 h-3 rounded-full mr-2 ${dungEaterAvailable ? "bg-green-500" : "bg-red-500"}`}></div>
            <h4 className="font-semibold">Blessing of Despair (Dung Eater&apos;s Ending)</h4>
          </div>
          <p className="text-sm ml-5 mt-1">{dungEaterAvailable ? 
            "Available: Use the Mending Rune of the Fell Curse after defeating the final boss." : 
            isQuestlineActive('dung_eater') ? "Continue Dung Eater&apos;s questline to unlock this ending." : 
            "You need to complete Dung Eater&apos;s questline to unlock this ending."}</p>
        </div>
        
        <div className="mb-3 pb-3 border-b border-purple-200">
          <div className="flex items-center">
            <div className={`w-3 h-3 rounded-full mr-2 ${goldmaskAvailable ? "bg-green-500" : "bg-red-500"}`}></div>
            <h4 className="font-semibold">Age of Order (Goldmask&apos;s Ending)</h4>
          </div>
          <p className="text-sm ml-5 mt-1">{goldmaskAvailable ? 
            "Available: Use the Mending Rune of Perfect Order after defeating the final boss." : 
            isQuestlineActive('goldmask') ? "Continue Goldmask&apos;s questline to unlock this ending." : 
            "You need to complete Goldmask&apos;s questline to unlock this ending."}</p>
        </div>
        
        <div className="mb-3">
          <div className="flex items-center">
            <div className={`w-3 h-3 rounded-full mr-2 ${frenziedAvailable ? "bg-green-500" : "bg-red-500"}`}></div>
            <h4 className="font-semibold">Lord of Frenzied Flame</h4>
          </div>
          <p className="text-sm ml-5 mt-1">{frenziedAvailable ? 
            "Available: Will trigger automatically after defeating the final boss." : 
            completedSteps['mainQuests_erdtree_burning'] ? 
            "You can no longer unlock this ending in this playthrough as you&apos;ve already burned the Erdtree." : 
            "You need to find the Three Fingers before burning the Erdtree to unlock this ending."}</p>
        </div>
        
        <button 
          onClick={() => setShowEndingInfo(false)}
          className="mt-2 px-3 py-1 bg-purple-600 text-white text-sm rounded hover:bg-purple-700"
        >
          Close
        </button>
      </div>
    );
  };

  const resetProgress = () => {
    if (window.confirm("Are you sure you want to reset all progress?")) {
      setCompletedSteps({});
      setActiveQuestlines([]);
      setActiveSection('limgrave');
      setShowEndingInfo(false);
      setExpandedQuestline(null);
    }
  };

  const checkEndingConflicts = (endingPath: string) => {
    // Frenzied Flame conflicts with all other endings
    if (endingPath !== 'frenzied' && completedSteps['frenzied_three_fingers']) {
      return {
        hasConflict: true,
        message: "Warning: You have been embraced by the Three Fingers. This will override all other endings unless you use Miquella's Needle to reverse it."
      };
    }
    
    // No conflicts between other endings as they're chosen after the final boss
    return { hasConflict: false, message: "" };
  };

  const renderQuestWarnings = () => {
    const warnings = [];
    
    // Warning about Frenzied Flame locking out other endings
    if (isQuestlineActive('frenzied') && !completedSteps['frenzied_three_fingers']) {
      warnings.push({
        id: 'frenzied_warning',
        text: "Warning: Being embraced by the Three Fingers will lock you into the Frenzied Flame ending unless you complete Millicent's questline and use Miquella's Needle.",
        color: 'orange'
      });
    }
    
    // Warning about burning the Erdtree locking out Frenzied Flame
    if (!isQuestlineActive('frenzied') && !completedSteps['frenzied_three_fingers'] && completedSteps['mainQuests_fire_giant'] && !completedSteps['mainQuests_erdtree_burning']) {
      warnings.push({
        id: 'erdtree_warning',
        text: "Warning: Burning the Erdtree will lock you out of the Frenzied Flame ending unless you've already been embraced by the Three Fingers.",
        color: 'orange'
      });
    }
    
    // Warning about Fia's quest potentially being locked out
    if (isQuestlineActive('fia') && !completedSteps['fia_give_weathered'] && completedSteps['mainQuests_morgott']) {
      warnings.push({
        id: 'fia_warning',
        text: "Warning: Make sure to progress Fia's questline before completing too much of the game, as it can be locked out in late-game.",
        color: 'indigo'
      });
    }
    
    // Warning about Goldmask's quest requiring 37 Intelligence
    if (isQuestlineActive('goldmask') && !completedSteps['goldmask_leyndell_puzzle']) {
      warnings.push({
        id: 'goldmask_warning',
        text: "Note: You will need 37 Intelligence to help Goldmask solve the puzzle in Leyndell. Consider using Stargazer Heirloom talisman or Intelligence-boosting gear.",
        color: 'yellow'
      });
    }
    
    if (warnings.length === 0) return null;
    
    return (
      <div className="mt-4">
        {warnings.map(warning => (
          <div key={warning.id} className={`bg-${warning.color}-50 p-3 my-2 rounded-md border border-${warning.color}-200`}>
            <p className={`text-${warning.color}-700 font-medium`}>{warning.text}</p>
          </div>
        ))}
      </div>
    );
  };

  const renderActiveQuestlines = () => {
    if (activeQuestlines.length === 0) return null;
    
    return (
      <div className="mb-6">
        <h2 className="text-xl font-bold border-b pb-2 mb-4">Active Questlines</h2>
        
        {activeQuestlines.map(questline => {
          const endingNames: {[key: string]: string} = {
            'ranni': 'Age of Stars Ending (Ranni\'s Questline)',
            'frenzied': 'Lord of Frenzied Flame Ending',
            'fia': 'Age of Duskborn Ending (Fia\'s Questline)',
            'dung_eater': 'Blessing of Despair Ending (Dung Eater\'s Questline)',
            'goldmask': 'Age of Order Ending (Goldmask\'s Questline)'
          };
          
          const isExpanded = expandedQuestline === questline;
          
          return (
            <div key={questline} className="mb-4">
              <div 
                className="flex justify-between items-center bg-gray-100 p-3 rounded-t cursor-pointer hover:bg-gray-200"
                onClick={() => setExpandedQuestline(isExpanded ? null : questline)}
              >
                <h3 className="font-semibold">{endingNames[questline]}</h3>
                <div className="flex items-center">
                  <span className="mr-2 text-sm text-gray-600">
                    {optionalQuests[questline].filter(q => completedSteps[`${questline}_${q.id}`]).length} / {optionalQuests[questline].length}
                  </span>
                  <button className="text-gray-500">
                    {isExpanded ? '▲' : '▼'}
                  </button>
                </div>
              </div>
              
              {isExpanded && (
                <div className="bg-white rounded-b shadow p-4 border border-gray-200">
                  {renderEndingQuests(questline)}
                </div>
              )}
            </div>
          );
        })}
      </div>
    );
  };

  // Add a new function to calculate ending progress percentages
  const calculateEndingProgress = () => {
    type EndingProgressItem = {
      name: string;
      progress: number;
      available: boolean;
      color: string;
      active?: boolean;
      locked?: boolean;
    };

    // Helper function to calculate accurate progress for each questline
    const calculateQuestlineProgress = (questlinePrefix: string, totalSteps: number) => {
      const completedCount = Object.keys(completedSteps)
        .filter(key => key.startsWith(questlinePrefix) && completedSteps[key])
        .length;
      
      return Math.round((completedCount / totalSteps) * 100);
    };

    const endingProgress: Record<string, EndingProgressItem> = {
      standard: {
        name: 'Elden Lord (Standard)',
        progress: calculateQuestlineProgress('mainQuests_', Object.values(mainQuests).flat().length),
        available: completedSteps['mainQuests_final_boss'],
        color: 'amber'
      },
      ranni: {
        name: 'Age of Stars (Ranni)',
        progress: calculateQuestlineProgress('ranni_', optionalQuests.ranni.length),
        available: completedSteps['mainQuests_final_boss'] && isEndingPathComplete('ranni'),
        active: isQuestlineActive('ranni'),
        color: 'blue'
      },
      fia: {
        name: 'Age of Duskborn (Fia)',
        progress: calculateQuestlineProgress('fia_', optionalQuests.fia.length),
        available: completedSteps['mainQuests_final_boss'] && isEndingPathComplete('fia'),
        active: isQuestlineActive('fia'),
        color: 'indigo'
      },
      dung_eater: {
        name: 'Blessing of Despair (Dung Eater)',
        progress: calculateQuestlineProgress('dung_eater_', optionalQuests.dung_eater.length),
        available: completedSteps['mainQuests_final_boss'] && isEndingPathComplete('dung_eater'),
        active: isQuestlineActive('dung_eater'),
        color: 'red'
      },
      goldmask: {
        name: 'Age of Order (Goldmask)',
        progress: calculateQuestlineProgress('goldmask_', optionalQuests.goldmask.length),
        available: completedSteps['mainQuests_final_boss'] && isEndingPathComplete('goldmask'),
        active: isQuestlineActive('goldmask'),
        color: 'yellow'
      },
      frenzied: {
        name: 'Lord of Frenzied Flame',
        progress: calculateQuestlineProgress('frenzied_', optionalQuests.frenzied.length),
        available: completedSteps['mainQuests_final_boss'] && completedSteps['frenzied_three_fingers'],
        active: isQuestlineActive('frenzied'),
        color: 'orange',
        locked: completedSteps['mainQuests_erdtree_burning'] && !completedSteps['frenzied_three_fingers']
      }
    };
    
    return endingProgress;
  };

  // Helper function to convert color names to hex values
  const getColorForEnding = (color: string) => {
    const colorMap: Record<string, string> = {
      amber: '#f59e0b',   // amber-500
      blue: '#3b82f6',    // blue-500
      indigo: '#6366f1',  // indigo-500 
      red: '#ef4444',     // red-500
      yellow: '#eab308',  // yellow-500
      orange: '#f97316',  // orange-500
    };
    
    return colorMap[color] || '#6b7280'; // default to gray-500
  };

  // Add a new component to render the ending progress tracker
  const renderEndingProgressTracker = () => {
    const endingProgress = calculateEndingProgress();
    
    return (
      <div className="mb-6">
        <div className="flex justify-between items-center border-b pb-2 mb-4">
          <h2 className="text-xl font-bold">Ending Progress</h2>
          <button 
            onClick={() => setShowEndingInfo(!showEndingInfo)}
            className="px-3 py-1 bg-purple-600 text-white text-sm rounded hover:bg-purple-700"
          >
            {showEndingInfo ? 'Hide Details' : 'Show Details'}
          </button>
        </div>
        
        {Object.entries(endingProgress).map(([key, ending]) => (
          <div key={key} className={`mb-3 ${ending.active ? `border-l-4 border-${ending.color}-500 pl-3` : ''}`}>
            <div className="flex justify-between items-center mb-1">
              <div className="flex items-center">
                {ending.available && <span className="text-green-500 mr-2">✓</span>}
                {ending.locked && <span className="text-red-500 mr-2">✗</span>}
                <h3 className={`font-medium ${ending.active ? `text-${ending.color}-700` : ''}`}>{ending.name}</h3>
              </div>
              <span className={`text-sm ${ending.progress === 100 ? 'text-green-600 font-bold' : 'text-gray-600'}`}>
                {ending.progress}%
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2.5">
              <div 
                className="h-2.5 rounded-full"
                style={{ 
                  width: `${ending.progress}%`,
                  backgroundColor: getColorForEnding(ending.color)
                }}
              ></div>
            </div>
            {key !== 'standard' && !ending.active && ending.progress === 0 && (
              <p className="text-xs text-gray-500 mt-1">Start this questline to track progress</p>
            )}
          </div>
        ))}
        
        {renderEndingAvailability()}
      </div>
    );
  };

  // Update the renderBossInfo function
  const renderBossInfo = (bossId: string) => {
    const bossInfo = bossInfoData[bossId];
    if (!bossInfo) return null;

    const currentStats = bossInfoMode === 'balanced' ? bossInfo.recommendedStats : bossInfo.easyModeStats;
    const currentLevel = bossInfoMode === 'balanced' ? bossInfo.recommendedLevel : bossInfo.easyModeLevel;
    const currentWeaponLevel = bossInfoMode === 'balanced' ? bossInfo.recommendedWeaponLevel : bossInfo.easyModeWeaponLevel;

    // Add suggested activities for leveling and weapon upgrades
    const getLevelingActivities = () => {
      const activities = [];
      
      // Different suggestions based on the boss/area
      switch(bossId) {
        case 'margit':
          activities.push("Clear all minor dungeons in Limgrave (caves and catacombs)");
          activities.push("Defeat the Tree Sentinel in Limgrave for a good rune reward");
          activities.push("Explore Coastal Cave and defeat the Demi-Human Chiefs");
          activities.push("Clear Fort Haight in eastern Limgrave");
          activities.push("Farm the trolls near Waypoint Ruins for runes");
          break;
        case 'godrick':
          activities.push("Explore all of Stormveil Castle thoroughly");
          activities.push("Clear Morne Castle in the Weeping Peninsula");
          activities.push("Defeat Flying Dragon Agheel in Limgrave");
          activities.push("Complete Murkwater Cave and defeat Patches");
          activities.push("Explore Limgrave Underground tunnels for Smithing Stones");
          break;
        case 'rennala':
          activities.push("Explore Liurnia's eastern and western shores");
          activities.push("Clear the Caria Manor in northern Liurnia");
          activities.push("Complete the Academy Crystal Cave for upgrade materials");
          activities.push("Defeat the Tibia Mariner in Liurnia for a Deathroot");
          activities.push("Explore the Converted Tower for Smithing Stones");
          break;
        case 'radahn':
          activities.push("Clear Fort Faroth in eastern Caelid for a large rune reward");
          activities.push("Explore Sellia, Town of Sorcery in Caelid");
          activities.push("Complete the Caelid Catacombs and Tunnels");
          activities.push("Farm the smaller dragons in Dragonbarrow");
          activities.push("Defeat the Night's Cavalry in Caelid at night");
          break;
        case 'morgott':
          activities.push("Explore the Capital Outskirts thoroughly");
          activities.push("Clear the Auriza Hero's Grave near the capital");
          activities.push("Defeat the Draconic Tree Sentinel guarding the capital");
          activities.push("Complete the Sealed Tunnel for Smithing Stones");
          activities.push("Explore Nokron, Eternal City if you've defeated Radahn");
          break;
        case 'fire_giant':
          activities.push("Explore all of the Mountaintops of the Giants");
          activities.push("Clear Castle Sol in the northern Mountaintops");
          activities.push("Defeat the Night's Cavalry in the Mountaintops");
          activities.push("Complete the Giants' Mountaintop Catacombs");
          activities.push("Farm the trolls near the Freezing Lake for runes");
          break;
        case 'godskin_duo':
        case 'maliketh':
          activities.push("Explore all of Crumbling Farum Azula");
          activities.push("Defeat the Ancient Dragon Lansseax");
          activities.push("Complete Mohgwyn Palace area if accessible");
          activities.push("Explore Consecrated Snowfield and Haligtree if accessible");
          activities.push("Farm the dragon in Crumbling Farum Azula");
          break;
        case 'godfrey':
        case 'final_boss':
          activities.push("Explore all of Leyndell, Ashen Capital");
          activities.push("Complete any remaining side dungeons");
          activities.push("Defeat any remaining optional bosses");
          activities.push("Complete Mohgwyn Palace if not done already");
          activities.push("Explore Miquella's Haligtree and defeat Malenia (very challenging)");
          break;
        default:
          activities.push("Explore nearby caves and catacombs for runes and materials");
          activities.push("Complete side dungeons in the current area");
          activities.push("Defeat field bosses marked on your map");
          activities.push("Help other players defeat bosses as a co-op summon");
      }
      
      // Add general activities that apply to all areas
      activities.push("Farm runes from respawning enemies in appropriate-level areas");
      activities.push("Search for Golden Seeds and Sacred Tears to improve your flasks");
      
      return activities;
    };
    
    const getWeaponUpgradeLocations = (targetLevel: number) => {
      const locations = [];
      
      if (targetLevel <= 3) {
        locations.push("Limgrave Tunnels - Smithing Stone [1]");
        locations.push("Coastal Cave - Smithing Stone [1]");
        locations.push("Purchase from Twin Maiden Husks after finding Smithing-Stone Miner's Bell Bearing [1]");
      }
      if (targetLevel <= 6) {
        locations.push("Raya Lucaria Crystal Tunnel - Smithing Stone [2]");
        locations.push("Liurnia Tunnels - Smithing Stone [2]");
        locations.push("Academy of Raya Lucaria - Smithing Stone [2] and [3]");
      }
      if (targetLevel <= 12) {
        locations.push("Sealed Tunnel (Altus Plateau) - Smithing Stone [3] and [4]");
        locations.push("Altus Tunnel - Smithing Stone [3] and [4]");
        locations.push("Mt. Gelmir - Smithing Stone [4]");
      }
      if (targetLevel <= 18) {
        locations.push("Mountaintops of the Giants - Smithing Stone [5] and [6]");
        locations.push("First Church of Marika - Smithing-Stone Miner's Bell Bearing [3]");
        locations.push("Zamor Ruins - Smithing Stone [6]");
      }
      if (targetLevel <= 25) {
        locations.push("Crumbling Farum Azula - Smithing Stone [7] and [8]");
        locations.push("Miquella's Haligtree - Smithing Stone [7] and [8]");
        locations.push("Mohgwyn Palace - Smithing Stone [7] and [8]");
        locations.push("Ancient Dragon Smithing Stone can be found in late-game areas");
      }
      
      return locations;
    };

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
          <div className="sticky top-0 bg-gradient-to-r from-amber-700 to-red-900 text-white p-4 rounded-t-lg flex justify-between items-center">
            <h3 className="text-xl font-bold">{bossInfo.name}</h3>
            <button 
              onClick={() => setShowBossInfo(null)}
              className="text-white hover:text-gray-200"
            >
              ✕
            </button>
          </div>
          
          <div className="p-6">
            <div className="mb-4">
              <div className="flex justify-center space-x-4 mb-6">
                <button
                  onClick={() => setBossInfoMode('balanced')}
                  className={`px-4 py-2 rounded-md ${
                    bossInfoMode === 'balanced'
                      ? 'bg-amber-600 text-white'
                      : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  }`}
                >
                  Balanced Mode
                </button>
                <button
                  onClick={() => setBossInfoMode('easy')}
                  className={`px-4 py-2 rounded-md ${
                    bossInfoMode === 'easy'
                      ? 'bg-green-600 text-white'
                      : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  }`}
                >
                  Easy Mode
                </button>
              </div>
              
              <div className={`p-4 rounded-lg border ${
                bossInfoMode === 'balanced' ? 'bg-amber-50 border-amber-200' : 'bg-green-50 border-green-200'
              }`}>
                <h4 className={`font-bold mb-2 ${
                  bossInfoMode === 'balanced' ? 'text-amber-800' : 'text-green-800'
                }`}>
                  {bossInfoMode === 'balanced' ? 'Recommended (Balanced)' : 'Easy Mode (Overlevel)'}
                </h4>
                <div className="space-y-2">
                  <p><span className="font-semibold">Level:</span> {currentLevel}</p>
                  <p><span className="font-semibold">Weapon:</span> +{currentWeaponLevel} Flamberge</p>
                </div>
              </div>
            </div>
            
            <div className="mb-6">
              <h4 className="font-bold text-gray-800 mb-3">Recommended Stats for Flamberge Build</h4>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="bg-gray-100 p-3 rounded text-center">
                  <div className="font-semibold">Vigor</div>
                  <div className="text-xl">{currentStats.vigor}</div>
                </div>
                <div className="bg-gray-100 p-3 rounded text-center">
                  <div className="font-semibold">Mind</div>
                  <div className="text-xl">{currentStats.mind}</div>
                </div>
                <div className="bg-gray-100 p-3 rounded text-center">
                  <div className="font-semibold">Endurance</div>
                  <div className="text-xl">{currentStats.endurance}</div>
                </div>
                <div className="bg-gray-100 p-3 rounded text-center">
                  <div className="font-semibold">Strength</div>
                  <div className="text-xl">{currentStats.strength}</div>
                </div>
                <div className="bg-gray-100 p-3 rounded text-center">
                  <div className="font-semibold">Dexterity</div>
                  <div className="text-xl">{currentStats.dexterity}</div>
                </div>
                <div className="bg-gray-100 p-3 rounded text-center">
                  <div className="font-semibold">Intelligence</div>
                  <div className="text-xl">{currentStats.intelligence}</div>
                </div>
                <div className="bg-gray-100 p-3 rounded text-center">
                  <div className="font-semibold">Faith</div>
                  <div className="text-xl">{currentStats.faith}</div>
                </div>
                <div className="bg-gray-100 p-3 rounded text-center">
                  <div className="font-semibold">Arcane</div>
                  <div className="text-xl">{currentStats.arcane}</div>
                </div>
              </div>
            </div>
            
            {/* New section for leveling and upgrade suggestions */}
            <div className="mb-6 bg-blue-50 p-4 rounded-lg border border-blue-200">
              <h4 className="font-bold text-blue-800 mb-3">Need to Level Up or Upgrade?</h4>
              
              <div className="mb-4">
                <h5 className="font-semibold text-blue-700 mb-2">Suggested Activities for Leveling:</h5>
                <ul className="list-disc pl-5 space-y-1 text-blue-900">
                  {getLevelingActivities().map((activity, index) => (
                    <li key={index}>{activity}</li>
                  ))}
                </ul>
              </div>
              
              <div>
                <h5 className="font-semibold text-blue-700 mb-2">Where to Find Weapon Upgrade Materials:</h5>
                <ul className="list-disc pl-5 space-y-1 text-blue-900">
                  {getWeaponUpgradeLocations(currentWeaponLevel).map((location, index) => (
                    <li key={index}>{location}</li>
                  ))}
                </ul>
              </div>
            </div>
            
            {bossInfo.recommendedWeapons && (
              <div className="mb-6">
                <h4 className="font-bold text-gray-800 mb-3">Recommended Weapons</h4>
                <ul className="list-disc pl-5 space-y-1">
                  {bossInfo.recommendedWeapons.map((weapon, index) => (
                    <li key={index} className="text-gray-700">{weapon}</li>
                  ))}
                </ul>
              </div>
            )}
            
            {bossInfo.recommendedAshes && (
              <div className="mb-6">
                <h4 className="font-bold text-gray-800 mb-3">Recommended Ashes of War</h4>
                <ul className="list-disc pl-5 space-y-1">
                  {bossInfo.recommendedAshes.map((ash, index) => (
                    <li key={index} className="text-gray-700">{ash}</li>
                  ))}
                </ul>
              </div>
            )}
            
            <div>
              <h4 className="font-bold text-gray-800 mb-3">Combat Tips</h4>
              <ul className="list-disc pl-5 space-y-2">
                {bossInfo.tips.map((tip, index) => (
                  <li key={index} className="text-gray-700">{tip}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const isDetailedQuestActive = (questId: string) => activeDetailedQuests.includes(questId);

  const toggleDetailedQuest = (questId: string) => {
    if (isDetailedQuestActive(questId)) {
      setActiveDetailedQuests(prev => prev.filter(q => q !== questId));
      if (expandedDetailedQuest === questId) {
        setExpandedDetailedQuest(null);
      }
    } else {
      setActiveDetailedQuests(prev => [...prev, questId]);
      setExpandedDetailedQuest(questId);
      // Hide the quest details modal if it's open
      if (showQuestDetails === questId) {
        setShowQuestDetails(null);
      }
    }
  };

  return (
    <div className="font-sans max-w-4xl mx-auto p-4">
      <div className="bg-gradient-to-r from-amber-700 to-red-900 text-white p-6 rounded-lg shadow-lg mb-6">
        <h1 className="text-2xl font-bold mb-2">Vanzans Elden Ring Interactive Guide</h1>
        <p>Track your progress and choose your path to different endings</p>
      </div>
      
      <div className="mb-6">
        <div className="flex items-center justify-between border-b pb-4">
          <h2 className="text-xl font-bold">Main Questline</h2>
          <div className="flex space-x-2">
            <button 
              onClick={resetProgress}
              className="px-3 py-1 bg-red-600 text-white text-sm rounded hover:bg-red-700"
            >
              Reset Progress
            </button>
          </div>
        </div>
        
        <div className="alert bg-amber-50 border-l-4 border-amber-500 p-4 my-4">
          <p className="font-semibold text-amber-700">{getNextStepMessage()}</p>
        </div>
        
        {renderDecisionPoints()}
        {renderQuestWarnings()}
        
        <div className="mb-4">
          <div className="flex flex-wrap gap-2 mb-4">
            {sectionsData.map((section) => (
              <button
                key={section.id}
                onClick={() => setActiveSection(section.id)}
                className={`px-3 py-1 text-sm rounded ${
                  activeSection === section.id
                    ? 'bg-amber-600 text-white'
                    : areAllPrerequisitesComplete(section.id)
                    ? 'bg-amber-100 text-amber-800 hover:bg-amber-200'
                    : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                }`}
                disabled={!areAllPrerequisitesComplete(section.id)}
              >
                {section.name}
                {allSectionComplete(section.id) && ' ✓'}
              </button>
            ))}
          </div>
          
          <div className="bg-white rounded-lg shadow p-4">
            <h3 className="font-bold text-lg mb-2">{sectionsData.find(s => s.id === activeSection)?.name}</h3>
            {renderMainQuests(activeSection)}
          </div>
        </div>
      </div>
      
      {renderEndingProgressTracker()}
      
      {renderActiveQuestlines()}
      
      {showBossInfo && renderBossInfo(showBossInfo)}
      
      <div className="text-xs text-gray-500 mt-8">
        <p>Vanzans Interactive guide for Elden Ring progression. Check steps as you complete them to track your progress.</p>
      </div>
    </div>
  );
};

export default InteractiveEldenRingGuide; 