import React, { useState } from 'react';

const InteractiveEldenRingGuide = () => {
  const [completedSteps, setCompletedSteps] = useState({});
  const [activeSection, setActiveSection] = useState('limgrave');
  const [selectedEnding, setSelectedEnding] = useState(null);
  const [showEndingInfo, setShowEndingInfo] = useState(false);

  const mainQuests = {
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

  const optionalQuests = {
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
    ]
  };

  const isStepComplete = (section, id) => completedSteps[`${section}_${id}`];

  const toggleStep = (section, id) => {
    setCompletedSteps(prev => ({
      ...prev,
      [`${section}_${id}`]: !prev[`${section}_${id}`]
    }));
  };

  const allSectionComplete = (section) => {
    return mainQuests[section].every(quest => completedSteps[`mainQuests_${quest.id}`]);
  };

  const areAllPrerequisitesComplete = (section) => {
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

  const isEndingPathComplete = (path) => {
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

  const getNextStepMessage = () => {
    for (const section of sectionsData) {
      if (!allSectionComplete(`${section.id}`)) {
        const nextStep = mainQuests[section.id].find(quest => !completedSteps[`mainQuests_${quest.id}`]);
        if (nextStep) {
          return `Next main quest step: ${nextStep.text} in ${section.name}`;
        }
      }
    }
    
    if (selectedEnding === 'ranni' && !isEndingPathComplete('ranni')) {
      const nextStep = optionalQuests.ranni.find(quest => !completedSteps[`ranni_${quest.id}`]);
      return nextStep ? `Next step for Age of Stars ending: ${nextStep.text}` : '';
    }
    
    if (selectedEnding === 'frenzied' && !isEndingPathComplete('frenzied')) {
      const nextStep = optionalQuests.frenzied.find(quest => !completedSteps[`frenzied_${quest.id}`]);
      return nextStep ? `Next step for Lord of Frenzied Flame ending: ${nextStep.text}` : '';
    }
    
    if (completedSteps['mainQuests_final_boss']) {
      return 'You have completed the main quest! Choose your ending.';
    }
    
    return 'Continue with the main quest.';
  };

  const renderMainQuests = (section) => {
    return mainQuests[section].map(quest => (
      <div key={quest.id} className="p-2 border-b border-gray-200 hover:bg-gray-50">
        <label className="flex items-start gap-2 cursor-pointer">
          <input
            type="checkbox"
            checked={completedSteps[`mainQuests_${quest.id}`] || false}
            onChange={() => toggleStep('mainQuests', quest.id)}
            className="mt-1"
          />
          <span className={completedSteps[`mainQuests_${quest.id}`] ? "line-through text-gray-500" : ""}>
            {quest.text}
          </span>
        </label>
      </div>
    ));
  };

  const renderEndingQuests = (path) => {
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

  // Important decision points based on progression
  const renderDecisionPoints = () => {
    // After Godrick but before Altus Plateau - good time to start Ranni
    if (completedSteps['mainQuests_godrick'] && !completedSteps['mainQuests_second_rune']) {
      return (
        <div className="bg-blue-50 p-3 my-4 rounded-md border border-blue-200">
          <h3 className="font-bold text-blue-700">Decision Point</h3>
          <p className="text-blue-700">Now is a good time to start Ranni's questline if you want the Age of Stars ending.</p>
          {!selectedEnding && (
            <button 
              onClick={() => setSelectedEnding('ranni')}
              className="mt-2 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              Start Ranni's Questline
            </button>
          )}
        </div>
      );
    }
    
    // Before burning the Erdtree, last chance for Three Fingers
    if (completedSteps['mainQuests_morgott'] && !completedSteps['mainQuests_erdtree_burning']) {
      return (
        <div className="bg-orange-50 p-3 my-4 rounded-md border border-orange-200">
          <h3 className="font-bold text-orange-700">Important Decision Point</h3>
          <p className="text-orange-700">This is your last chance to find the Three Fingers for the Lord of Frenzied Flame ending.</p>
          {!selectedEnding && (
            <button 
              onClick={() => setSelectedEnding('frenzied')}
              className="mt-2 px-4 py-2 bg-orange-600 text-white rounded hover:bg-orange-700"
            >
              Pursue Frenzied Flame Ending
            </button>
          )}
        </div>
      );
    }
    
    // After final boss
    if (completedSteps['mainQuests_final_boss']) {
      return (
        <div className="bg-green-50 p-3 my-4 rounded-md border border-green-200">
          <h3 className="font-bold text-green-700">Game Complete!</h3>
          <p className="text-green-700">You've defeated the final boss. Choose your ending:</p>
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
            <h4 className="font-semibold">Age of Stars (Ranni's Ending)</h4>
          </div>
          <p className="text-sm ml-5 mt-1">{ranniAvailable ? 
            "Available: Look for Ranni's blue summon sign after defeating the final boss." : 
            selectedEnding === 'ranni' ? "Continue Ranni's questline to unlock this ending." : 
            "You need to complete Ranni's questline to unlock this ending."}</p>
        </div>
        
        <div className="mb-3">
          <div className="flex items-center">
            <div className={`w-3 h-3 rounded-full mr-2 ${frenziedAvailable ? "bg-green-500" : "bg-red-500"}`}></div>
            <h4 className="font-semibold">Lord of Frenzied Flame</h4>
          </div>
          <p className="text-sm ml-5 mt-1">{frenziedAvailable ? 
            "Available: Will trigger automatically after defeating the final boss." : 
            completedSteps['mainQuests_erdtree_burning'] ? 
            "You can no longer unlock this ending in this playthrough as you've already burned the Erdtree." : 
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
    if (confirm("Are you sure you want to reset all progress?")) {
      setCompletedSteps({});
      setSelectedEnding(null);
      setActiveSection('limgrave');
      setShowEndingInfo(false);
    }
  };

  const changeEnding = () => {
    setSelectedEnding(null);
  };

  return (
    <div className="font-sans max-w-4xl mx-auto p-4">
      <div className="bg-gradient-to-r from-amber-700 to-red-900 text-white p-6 rounded-lg shadow-lg mb-6">
        <h1 className="text-2xl font-bold mb-2">Elden Ring Interactive Guide</h1>
        <p>Track your progress and choose your path to different endings</p>
      </div>
      
      <div className="mb-6">
        <div className="flex items-center justify-between border-b pb-4">
          <h2 className="text-xl font-bold">Main Questline</h2>
          <div className="flex space-x-2">
            {selectedEnding && (
              <button 
                onClick={changeEnding}
                className="px-3 py-1 bg-yellow-600 text-white text-sm rounded hover:bg-yellow-700"
              >
                Change Ending Path
              </button>
            )}
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
        {renderEndingAvailability()}
        
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
      
      {selectedEnding && (
        <div className="mb-6">
          <h2 className="text-xl font-bold border-b pb-2 mb-4">
            {selectedEnding === 'ranni' ? 'Age of Stars Ending (Ranni\'s Questline)' : 'Lord of Frenzied Flame Ending'}
          </h2>
          <div className="bg-white rounded-lg shadow p-4">
            {renderEndingQuests(selectedEnding)}
          </div>
        </div>
      )}
      
      <div className="text-xs text-gray-500 mt-8">
        <p>Interactive guide for Elden Ring progression. Check steps as you complete them to track your progress.</p>
      </div>
    </div>
  );
};

export default InteractiveEldenRingGuide;
