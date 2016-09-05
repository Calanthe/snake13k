/* eslint no-sparse-arrays: "off" */
var Snake = Snake || {};

Snake.Font = {
	characterPixelsWidth: 3,

	// http://robey.lag.net/2010/01/23/tiny-monospace-font.html
	// http://www.dafont.com/bitmap.php
	font: {
		"0": [
			[1,1,1],
			[1, ,1],
			[1, ,1],
			[1, ,1],
			[1,1,1]
		],
		"1": [
			[ ,1  ],
			[1,1  ],
			[ ,1  ],
			[ ,1  ],
			[ ,1  ]
		],
		"2": [
			[1,1,1],
			[ , ,1],
			[1,1,1],
			[1    ],
			[1,1,1]
		],
		"3": [
			[1,1,1],
			[ , ,1],
			[ ,1,1],
			[ , ,1],
			[1,1,1]
		],
		"4": [
			[1, ,1],
			[1, ,1],
			[1,1,1],
			[ , ,1],
			[ , ,1]
		],
		"5": [
			[1,1,1],
			[1, , ],
			[1,1,1],
			[ , ,1],
			[1,1,1]
		],
		"6": [
			[1,1,1],
			[1, , ],
			[1,1,1],
			[1, ,1],
			[1,1,1]
		],
		"7": [
			[1,1,1],
			[ , ,1],
			[ , ,1],
			[ , ,1],
			[ , ,1]
		],
		"8": [
			[1,1,1],
			[1, ,1],
			[1,1,1],
			[1, ,1],
			[1,1,1]
		],
		"9": [
			[1,1,1],
			[1, ,1],
			[1,1,1],
			[ , ,1],
			[1,1,1]
		],
		" ": [
			[     ]
		],
		"A": [
			[ ,1  ],
			[1, ,1],
			[1,1,1],
			[1, ,1],
			[1, ,1]
		],
		"B": [
			[1,1  ],
			[1, ,1],
			[1,1  ],
			[1, ,1],
			[1,1  ]
		],
		"C": [
			[ ,1,1],
			[1    ],
			[1    ],
			[1    ],
			[ ,1,1]
		],
		"D": [
			[1,1  ],
			[1, ,1],
			[1, ,1],
			[1, ,1],
			[1,1  ]
		],
		"E": [
			[1,1,1],
			[1    ],
			[1,1,1],
			[1    ],
			[1,1,1]
		],
		"F": [
			[1,1,1],
			[1    ],
			[1,1,1],
			[1    ],
			[1    ]
		],
		"G": [
			[ ,1,1],
			[1    ],
			[1, ,1],
			[1, ,1],
			[ ,1,1]
		],
		"H": [
			[1, ,1],
			[1, ,1],
			[1,1,1],
			[1, ,1],
			[1, ,1]
		],
		"I": [
			[1,1,1],
			[ ,1  ],
			[ ,1  ],
			[ ,1  ],
			[1,1,1]
		],
		"J": [
			[ , ,1],
			[ , ,1],
			[ , ,1],
			[1, ,1],
			[ ,1  ]
		],
		"K": [
			[1, ,1],
			[1, ,1],
			[1,1  ],
			[1, ,1],
			[1, ,1]
		],
		"L": [
			[1, , ],
			[1, , ],
			[1, , ],
			[1, , ],
			[1,1,1]
		],
		"M": [
			[1, ,1],
			[1,1,1],
			[1,1,1],
			[1, ,1],
			[1, ,1]
		],
		"N": [
			[1, ,1],
			[1,1,1],
			[1,1,1],
			[1,1,1],
			[1, ,1]
		],
		"O": [
			[ ,1  ],
			[1, ,1],
			[1, ,1],
			[1, ,1],
			[ ,1  ]
		],
		"P": [
			[1,1  ],
			[1, ,1],
			[1,1  ],
			[1    ],
			[1    ]
		],
		"Q": [
			[ ,1  ],
			[1, ,1],
			[1, ,1],
			[1, ,1],
			[ ,1,1]
		],
		"R": [
			[1,1  ],
			[1, ,1],
			[1,1,1],
			[1,1  ],
			[1, ,1]
		],
		"S": [
			[ ,1,1],
			[1    ],
			[ ,1  ],
			[ , ,1],
			[1,1  ]
		],
		"T": [
			[1,1,1],
			[ ,1  ],
			[ ,1  ],
			[ ,1  ],
			[ ,1  ]
		],
		"U": [
			[1, ,1],
			[1, ,1],
			[1, ,1],
			[1, ,1],
			[ ,1,1]
		],
		"V": [
			[1, ,1],
			[1, ,1],
			[1, ,1],
			[ ,1  ],
			[ ,1  ]
		],
		"W": [
			[1, ,1],
			[1, ,1],
			[1,1,1],
			[1,1,1],
			[1, ,1]
		],
		"X": [
			[1, ,1],
			[1, ,1],
			[ ,1  ],
			[1, ,1],
			[1, ,1]
		],
		"Y": [
			[1, ,1],
			[1, ,1],
			[ ,1  ],
			[ ,1  ],
			[ ,1  ]
		],
		"Z": [
			[1,1,1],
			[ , ,1],
			[ ,1  ],
			[1    ],
			[1,1,1]
		],
		"a": [
			[     ],
			[1,1  ],
			[ ,1,1],
			[1, ,1],
			[1,1,1]
		],
		"b": [
			[1    ],
			[1,1  ],
			[1, ,1],
			[1, ,1],
			[1,1  ]
		],
		"c": [
			[     ],
			[ ,1,1],
			[1    ],
			[1    ],
			[ ,1,1]
		],
		"d": [
			[ , ,1],
			[ ,1,1],
			[1, ,1],
			[1, ,1],
			[ ,1,1]
		],
		"e": [
			[     ],
			[ ,1,1],
			[1, ,1],
			[1,1  ],
			[ ,1,1]
		],
		"f": [
			[ , ,1],
			[ ,1  ],
			[1,1,1],
			[ ,1  ],
			[ ,1  ]
		],
		"g": [
			[     ],
			[ ,1,1],
			[1, ,1],
			[1,1,1],
			[ , ,1],
			[ ,1  ]
		],
		"h": [
			[1    ],
			[1,1  ],
			[1, ,1],
			[1, ,1],
			[1, ,1]
		],
		"i": [
			[ ,1  ],
			[     ],
			[1,1  ],
			[ ,1  ],
			[ ,1  ]
		],
		"j": [
			[ , ,1],
			[     ],
			[ , ,1],
			[ , ,1],
			[1, ,1],
			[ ,1  ]
		],
		"k": [
			[1    ],
			[1, ,1],
			[1,1  ],
			[1,1  ],
			[1, ,1]
		],
		"l": [
			[1,1  ],
			[ ,1  ],
			[ ,1  ],
			[ ,1  ],
			[1,1,1]
		],
		"m": [
			[     ],
			[1, ,1],
			[1,1,1],
			[1,1,1],
			[1, ,1]
		],
		"n": [
			[     ],
			[1,1  ],
			[1, ,1],
			[1, ,1],
			[1, ,1]
		],
		"o": [
			[     ],
			[ ,1  ],
			[1, ,1],
			[1, ,1],
			[ ,1  ]
		],
		"p": [
			[     ],
			[1,1  ],
			[1, ,1],
			[1, ,1],
			[1,1  ],
			[1    ]
		],
		"q": [
			[     ],
			[ ,1,1],
			[1, ,1],
			[1, ,1],
			[ ,1,1],
			[ , ,1]
		],
		"r": [
			[     ],
			[ ,1,1],
			[1    ],
			[1    ],
			[1    ]
		],
		"s": [
			[     ],
			[ ,1,1],
			[1,1  ],
			[ ,1,1],
			[1,1  ]
		],
		"t": [
			[ ,1  ],
			[1,1,1],
			[ ,1  ],
			[ ,1  ],
			[ ,1,1]
		],
		"u": [
			[     ],
			[1, ,1],
			[1, ,1],
			[1, ,1],
			[ ,1,1]
		],
		"v": [
			[     ],
			[1, ,1],
			[1, ,1],
			[1,1,1],
			[ ,1  ]
		],
		"w": [
			[     ],
			[1, ,1],
			[1,1,1],
			[1,1,1],
			[1,1,1]
		],
		"x": [
			[     ],
			[1, ,1],
			[ ,1  ],
			[ ,1  ],
			[1, ,1]
		],
		"y": [
			[     ],
			[1, ,1],
			[1, ,1],
			[ ,1,1],
			[ , ,1],
			[ ,1  ]
		],
		"z": [
			[     ],
			[1,1,1],
			[ ,1,1],
			[1,1  ],
			[1,1,1]
		],
		"[": [
			[1,1  ],
			[1    ],
			[1    ],
			[1    ],
			[1,1  ]
		],
		"]": [
			[ ,1,1],
			[ , ,1],
			[ , ,1],
			[ , ,1],
			[ ,1,1]
		]
	}
};
