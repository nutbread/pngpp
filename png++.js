// node png++ test.jpg test.png 3m
(function () {
	"use strict";

	// Libraries
	var fs = require("fs"),
		path = require("path"),
		zlib = require("zlib"),
		child_process = require("child_process"),
		version_info = [ 1 , 0 ];



	// Vars
	var ffmpeg_exe = "ffmpeg";

	// PNG creation
	var crc_table = new Uint32Array([ //{
		0x00000000, 0x77073096, 0xEE0E612C, 0x990951BA, 0x076DC419, 0x706AF48F, 0xE963A535, 0x9E6495A3,
		0x0EDB8832, 0x79DCB8A4, 0xE0D5E91E, 0x97D2D988, 0x09B64C2B, 0x7EB17CBD, 0xE7B82D07, 0x90BF1D91,
		0x1DB71064, 0x6AB020F2, 0xF3B97148, 0x84BE41DE, 0x1ADAD47D, 0x6DDDE4EB, 0xF4D4B551, 0x83D385C7,
		0x136C9856, 0x646BA8C0, 0xFD62F97A, 0x8A65C9EC, 0x14015C4F, 0x63066CD9, 0xFA0F3D63, 0x8D080DF5,
		0x3B6E20C8, 0x4C69105E, 0xD56041E4, 0xA2677172, 0x3C03E4D1, 0x4B04D447, 0xD20D85FD, 0xA50AB56B,
		0x35B5A8FA, 0x42B2986C, 0xDBBBC9D6, 0xACBCF940, 0x32D86CE3, 0x45DF5C75, 0xDCD60DCF, 0xABD13D59,
		0x26D930AC, 0x51DE003A, 0xC8D75180, 0xBFD06116, 0x21B4F4B5, 0x56B3C423, 0xCFBA9599, 0xB8BDA50F,
		0x2802B89E, 0x5F058808, 0xC60CD9B2, 0xB10BE924, 0x2F6F7C87, 0x58684C11, 0xC1611DAB, 0xB6662D3D,
		0x76DC4190, 0x01DB7106, 0x98D220BC, 0xEFD5102A, 0x71B18589, 0x06B6B51F, 0x9FBFE4A5, 0xE8B8D433,
		0x7807C9A2, 0x0F00F934, 0x9609A88E, 0xE10E9818, 0x7F6A0DBB, 0x086D3D2D, 0x91646C97, 0xE6635C01,
		0x6B6B51F4, 0x1C6C6162, 0x856530D8, 0xF262004E, 0x6C0695ED, 0x1B01A57B, 0x8208F4C1, 0xF50FC457,
		0x65B0D9C6, 0x12B7E950, 0x8BBEB8EA, 0xFCB9887C, 0x62DD1DDF, 0x15DA2D49, 0x8CD37CF3, 0xFBD44C65,
		0x4DB26158, 0x3AB551CE, 0xA3BC0074, 0xD4BB30E2, 0x4ADFA541, 0x3DD895D7, 0xA4D1C46D, 0xD3D6F4FB,
		0x4369E96A, 0x346ED9FC, 0xAD678846, 0xDA60B8D0, 0x44042D73, 0x33031DE5, 0xAA0A4C5F, 0xDD0D7CC9,
		0x5005713C, 0x270241AA, 0xBE0B1010, 0xC90C2086, 0x5768B525, 0x206F85B3, 0xB966D409, 0xCE61E49F,
		0x5EDEF90E, 0x29D9C998, 0xB0D09822, 0xC7D7A8B4, 0x59B33D17, 0x2EB40D81, 0xB7BD5C3B, 0xC0BA6CAD,
		0xEDB88320, 0x9ABFB3B6, 0x03B6E20C, 0x74B1D29A, 0xEAD54739, 0x9DD277AF, 0x04DB2615, 0x73DC1683,
		0xE3630B12, 0x94643B84, 0x0D6D6A3E, 0x7A6A5AA8, 0xE40ECF0B, 0x9309FF9D, 0x0A00AE27, 0x7D079EB1,
		0xF00F9344, 0x8708A3D2, 0x1E01F268, 0x6906C2FE, 0xF762575D, 0x806567CB, 0x196C3671, 0x6E6B06E7,
		0xFED41B76, 0x89D32BE0, 0x10DA7A5A, 0x67DD4ACC, 0xF9B9DF6F, 0x8EBEEFF9, 0x17B7BE43, 0x60B08ED5,
		0xD6D6A3E8, 0xA1D1937E, 0x38D8C2C4, 0x4FDFF252, 0xD1BB67F1, 0xA6BC5767, 0x3FB506DD, 0x48B2364B,
		0xD80D2BDA, 0xAF0A1B4C, 0x36034AF6, 0x41047A60, 0xDF60EFC3, 0xA867DF55, 0x316E8EEF, 0x4669BE79,
		0xCB61B38C, 0xBC66831A, 0x256FD2A0, 0x5268E236, 0xCC0C7795, 0xBB0B4703, 0x220216B9, 0x5505262F,
		0xC5BA3BBE, 0xB2BD0B28, 0x2BB45A92, 0x5CB36A04, 0xC2D7FFA7, 0xB5D0CF31, 0x2CD99E8B, 0x5BDEAE1D,
		0x9B64C2B0, 0xEC63F226, 0x756AA39C, 0x026D930A, 0x9C0906A9, 0xEB0E363F, 0x72076785, 0x05005713,
		0x95BF4A82, 0xE2B87A14, 0x7BB12BAE, 0x0CB61B38, 0x92D28E9B, 0xE5D5BE0D, 0x7CDCEFB7, 0x0BDBDF21,
		0x86D3D2D4, 0xF1D4E242, 0x68DDB3F8, 0x1FDA836E, 0x81BE16CD, 0xF6B9265B, 0x6FB077E1, 0x18B74777,
		0x88085AE6, 0xFF0F6A70, 0x66063BCA, 0x11010B5C, 0x8F659EFF, 0xF862AE69, 0x616BFFD3, 0x166CCF45,
		0xA00AE278, 0xD70DD2EE, 0x4E048354, 0x3903B3C2, 0xA7672661, 0xD06016F7, 0x4969474D, 0x3E6E77DB,
		0xAED16A4A, 0xD9D65ADC, 0x40DF0B66, 0x37D83BF0, 0xA9BCAE53, 0xDEBB9EC5, 0x47B2CF7F, 0x30B5FFE9,
		0xBDBDF21C, 0xCABAC28A, 0x53B39330, 0x24B4A3A6, 0xBAD03605, 0xCDD70693, 0x54DE5729, 0x23D967BF,
		0xB3667A2E, 0xC4614AB8, 0x5D681B02, 0x2A6F2B94, 0xB40BBE37, 0xC30C8EA1, 0x5A05DF1B, 0x2D02EF8D,
	]); //}
	var crc32 = function (data, crc) {
		var data_len = data.length,
			ct = crc_table,
			i = 0;

		crc = (crc ^ 0xFFFFFFFF) >>> 0;

		for (; i < data_len; ++i) {
			crc = (crc >>> 8) ^ ct[(crc ^ data[i]) & 0xFF];
		}

		return (crc ^ 0xFFFFFFFF) >>> 0;
	};
	crc32.init = 0;
	var adler32 = function (data, pre) {
		var len = data.length,
			a = pre & 0xFFFF,
			b = (pre >>> 16) & 0xFFFF,
			i = 0;

		for (; i < len; ++i) {
			a = (a + data[i]) % 65521;
			b = (b + a) % 65521;
		}

		return ((b << 16) | a) >>> 0;
	};
	adler32.init = 1;

	var png_header = function (image, interlaced) {
		var buf = new Buffer(33);

		buffer_write_array(buf, 0, [ 0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a ]);

		buf.writeUInt32BE(13, 8, true); // length
		buf.write("IHDR", 12, 4, "utf8"); // tag
		buf.writeUInt32BE(image.width, 16, true); // width
		buf.writeUInt32BE(image.height, 20, true); // height
		buf.writeUInt8(image.bytes_per_component * 8, 24, true); // bit depth
		buf.writeUInt8(image.mode_to_png_mode(), 25, true); // color mode
		buf.writeUInt8(0, 26, true); // compression method
		buf.writeUInt8(0, 27, true); // filter method
		buf.writeUInt8(interlaced ? 1 : 0, 28, true); // interlace method
		buf.writeUInt32BE(crc32(buf.slice(12, buf.length - 4), crc32.init), 29, true); // crc

		return buf;
	};
	var png_trailer = function () {
		var buf = new Buffer(12);

		buf.writeUInt32BE(0, 0, true); // length
		buf.write("IEND", 4, 4, "utf8"); // tag
		buf.writeUInt32BE(crc32(buf.slice(4, buf.length - 4), crc32.init), 8, true); // crc

		return buf;
	};
	var png_deflate = function (input_get) {
		var segment_len = 0xfffb,
			buffers = [ new Buffer([ 0x78, 0x01 ]) ], // [CM=8, CINFO=7<<4], [FCHECK=1, FDICT=0<<5, FLEVEL=0<<6]
			buffers_length = 2,
			checksum = adler32.init,
			input, segments, remainder,
			i = 0,
			b, j;

		while (true) {
			input = input_get(i);
			if (input === null) break;
			++i;
			checksum = adler32(input, checksum);

			segments = Math.floor(input.length / segment_len);
			remainder = input.length - segments * segment_len;

			for (j = 0; j < segments; ++j) {
				buffers.push(new Buffer([ 0x00, 0xfb, 0xff, 0x04, 0x00 ])); // [0x00: not at end] [0xfb,0xff: length] [0x04,0x00: length inverse]
				buffers.push(input.slice(j * segment_len, (j + 1) * segment_len));
				buffers_length += 5 + segment_len;
			}

			if (remainder > 0 || segments === 0) {
				b = new Buffer(5);
				b[0] = 0x00;
				b[1] = remainder & 0xFF;
				b[2] = remainder >>> 8;
				b[3] = b[1] ^ 0xFF;
				b[4] = b[2] ^ 0xFF;
				buffers.push(b);
				buffers.push((b = input.slice(segment_len * segments))); // data
				buffers_length += 5 + b.length;
			}
		}

		buffers[buffers.length - 2][0] = 0x01; // at end of stream

		// CRC
		b = new Buffer(4);
		b.writeUInt32BE(checksum, 0, true); // crc
		buffers.push(b);

		return [ buffers, buffers_length + 4 ];
	};
	var png_data = function (input_get) {
		var data = png_deflate(input_get);
		return png_chunk("IDAT", data[0], data[1]);
	};
	var png_chunk = function (type, inputs, length) {
		var crcheck = new Buffer(4),
			crc_value = crc32.init,
			data = [ new Buffer(4), new Buffer(type, "utf8") ],
			i;

		if (inputs !== null) {
			Array.prototype.push.apply(data, inputs);
			if (length === undefined) {
				length = 0;
				for (i = 0; i < inputs.length; ++i) {
					length += inputs[i].length;
				}
			}
		}
		else {
			length = 0;
		}

		data[0].writeUInt32BE(length, 0, true); // length

		for (i = 1; i < data.length; ++i) {
			crc_value = crc32(data[i], crc_value);
		}

		crcheck.writeUInt32BE(crc_value, 0, true); // crc
		data.push(crcheck);

		return Buffer.concat(data, length + 12);
	};

	// Helpers
	var buffer_write_array = function (buffer, position, values) {
		for (var i = 0; i < values.length; ++i) {
			buffer[position] = values[i];
			++position;
		}
	};



	// Image bloating
	var bloat_image = function (image, output, target_size, settings) {
		// Filter stream
		var mode = bloat_image.MODE_EXTRA_IDAT_SECTIONS,
			interlaced = false,
			compress_whenever_possible = true,
			small_image = null,
			small_opacity = 0.5,
			firefox_bug = false,

			preprocess = null,
			data_pre = null,
			filter_stream, data, header, trailer, space_remaining, empty_buffer, size,
			f, pos, p, p_pre, inflate_len;

		// Settings
		if (settings) {
			if ("mode" in settings) mode = settings.mode;
			if ("interlaced" in settings) interlaced = settings.interlaced;
			if ("compress_whenever_possible" in settings) compress_whenever_possible = settings.compress_whenever_possible;

			if ("small" in settings) small_image = settings.small;
			if ("small_opacity" in settings) small_opacity = settings.small_opacity;
			if ("firefox_bug" in settings) firefox_bug = settings.firefox_bug;
		}

		// Header/trailer
		header = png_header(image, interlaced);
		trailer = png_trailer();

		if (mode === bloat_image.MODE_EXTRA_DEFLATES) {
			// Empty deflate segments
			filter_stream = image.to_filtered_stream();

			size = 5;
			space_remaining = target_size - filter_stream.length - header.length - trailer.length -
				(12 + 2 + 4 + size * Math.max(1, Math.ceil(filter_stream.length / 0xFFFB)));

			empty_buffer = new Buffer(0);

			data = png_data(function () {
				if (space_remaining < size) {
					if (space_remaining < 0) {
						return null;
					}
					else {
						space_remaining = -1;
						return filter_stream;
					}
				}
				else {
					space_remaining -= size;
					return empty_buffer;
				}
			});
		}
		else { // if (mode === bloat_image.MODE_EXTRA_IDAT_SECTIONS) {
			// Extra IDAT sections
			pos = firefox_bug ? 0 : 1;
			preprocess = function (levels) {
				if (small_image) {
					var b = levels[0].buffer,
						d = small_image.data,
						len = b.length,
						i, diff;

					for (i = 0; i < len; ++i) {
						diff = d[i] - b[i];
						b[i] = Math.round(b[i] + diff * small_opacity);
					}

					pos = len + levels[0].height;
				}
			};

			filter_stream = interlaced ?
				image.to_filtered_stream_paeth_interlaced(preprocess) :
				image.to_filtered_stream_paeth();

			// Compress data
			if (interlaced && small_image) {
				if (compress_whenever_possible) {
					// Compress
					data = zlib.deflateSync(filter_stream, {
						level: zlib.Z_BEST_COMPRESSION,
						memLevel: 9
					});

					// Find the position
					p = pos;
					p_pre = pos;
					while (true) {
						inflate_len = zlib.inflateSync(data.slice(0, p)).length;
						if (inflate_len <= pos) {
							pos = (inflate_len === pos ? p : p_pre);
							break;
						}

						p_pre = p;
						if (inflate_len < p) {
							p = inflate_len;
						}
						else {
							// Invalid?
							if (--p <= 0) break;
						}
					}
				}
				else {
					// No compression
					data = png_deflate(function (i) {
						return (i === 0 ? filter_stream : null);
					});
					data = Buffer.concat(data[0], data[1]);
				}

				// Split at the first interlace level
			}
			else {
				// Basic compression only
				data = zlib.deflateSync(filter_stream, {
					level: zlib.Z_BEST_COMPRESSION,
					memLevel: 9
				});
			}

			// Split
			if (pos > 0) {
				data_pre = png_chunk("IDAT", [ data.slice(0, pos) ]);
			}
			data = png_chunk("IDAT", [ data.slice(pos) ]);

			// Space remaining
			space_remaining = target_size - data.length - header.length - trailer.length;
			if (data_pre !== null) {
				space_remaining -= data_pre.length;
			}

			// Empty IDAT sections
			empty_buffer = png_chunk("IDAT", null);
		}

		// Write
		f = fs.openSync(output, "w");
		fs.writeSync(f, header, 0, header.length);
		if (data_pre !== null) {
			fs.writeSync(f, data_pre, 0, data_pre.length);
		}
		if (mode === bloat_image.MODE_EXTRA_IDAT_SECTIONS) {
			space_remaining -= empty_buffer.length;
			while (space_remaining > 0) {
				fs.writeSync(f, empty_buffer, 0, empty_buffer.length);
				space_remaining -= empty_buffer.length;
			}
		}
		fs.writeSync(f, data, 0, data.length);
		fs.writeSync(f, trailer, 0, trailer.length);
		fs.closeSync(f);

		// Done
		return null;
	};
	bloat_image.MODE_EXTRA_DEFLATES = 0;
	bloat_image.MODE_EXTRA_IDAT_SECTIONS = 1;



	// Size argument parsing
	var parse_size = function (target_size) {
		var re_size = /\s*([+-]?\d+(?:\.\d+)?)\s*([km]?b?)\s*/i,
			size_labels = {
				"": 1,
				"b": 1,
				"k": 1024,
				"m": 1024 * 1024,
			},
			m;

		// Match
		if ((m = re_size.exec(target_size)) === null) {
			return null;
		}

		// Value
		return Math.round(parseFloat(m[1]) * size_labels[m[2].substr(0, 1).toLowerCase()]);
	};



	// Raw image
	var RawImage = function (width, height, range, depth, mode, data) {
		this.width = width;
		this.height = height;
		this.range = range;
		this.channels = depth;
		this.bytes_per_component = (range > 255 ? 2 : 1);
		this.mode = mode;
		this.data = data;
	};

	RawImage.prototype = {
		constructor: RawImage,
		normalize: function () {
			// If there is an unnecessary alpha channel, remove it
			var buf, i, i_color, i_total, i_max, j, k;
			if (this.channels === 2) {
				buf = new Buffer(Math.floor(this.data.length / 2));
				i_color = this.bytes_per_component;
			}
			else if (this.channels === 4) {
				buf = new Buffer(Math.floor(this.data.length * 3 / 4));
				i_color = this.bytes_per_component * 3;
			}
			else {
				this.normalize_range();
				return;
			}

			// Fill and check alpha
			i_total = i_color + this.bytes_per_component;
			i_max = Math.floor(this.data.length / i_total) * i_total;
			k = 0;
			if (this.bytes_per_component === 1) {
				for (i = 0; i < i_max; i += i_total) {
					// Color
					j = i + i_color;
					this.data.copy(buf, k, i, j);

					// Alpha
					if (this.data[j] < this.range) {
						buf = null;
						break;
					}
					k += i_color;
				}
			}
			else {
				for (i = 0; i < i_max; i += i_total) {
					// Color
					j = i + i_color;
					this.data.copy(buf, k, i, j);

					// Alpha
					if (this.data.readUInt16BE(j, true) < this.range) {
						buf = null;
						break;
					}
					k += i_color;
				}
			}

			// Done
			if (buf !== null) {
				--this.channels;
				this.data = buf;
				this.mode = this.mode.replace(/_alpha$/, "");
			}
			this.normalize_range();
		},
		normalize_range: function () {
			// Normalize the range
			if (this.bytes_per_component === 1) {
				if (this.range === 0xFF) return;
			}
			else {
				if (this.range === 0xFFFF) return;
			}

			// Normalize values
			var len = this.data.length,
				new_buffer = new Buffer(len),
				i, v;

			if (this.bytes_per_component === 1) {
				for (i = 0; i < len; ++i) {
					new_buffer[i] = Math.round((this.data[i] / this.range) * 0xFF);
				}
				this.range = 0xFF;
			}
			else {
				len = Math.floor(len / 2) * 2;
				for (i = 0; i < len; i += 2) {
					v = this.data.readUInt16BE(i, true);
					v = Math.round((v / this.range) * 0xFFFF);
					new_buffer.writeUInt16BE(v, i, true);
				}
				this.range = 0xFFFF;
			}

			// Assign new buffer
			this.data = new_buffer;
		},
		get_ffmpeg_colorspace: function (){
			return RawImage.modes[this.mode][1][this.bytes_per_component === 1 ? 0 : 1];
		},
		mode_to_png_mode: function () {
			return RawImage.modes[this.mode][0];
		},
		to_filtered_stream: function () {
			// Filter stream
			var filter_stream = [],
				filter_stream_length = 0,
				scanline_byte_length = this.width * this.channels * this.bytes_per_component,
				data_length = this.data.length,
				filter_flag = new Buffer([ 0x00 ]),
				i;

			// Create stream with filter info
			for (i = 0; i < data_length; i += scanline_byte_length) {
				filter_stream_length += scanline_byte_length + 1;
				filter_stream.push(filter_flag);
				filter_stream.push(this.data.slice(i, i + scanline_byte_length));
			}

			// Return
			return Buffer.concat(filter_stream, filter_stream_length);
		},
		to_filtered_stream_paeth: function () {
			return this.paeth_stream_create(this.data, this.width, this.channels, this.bytes_per_component);
		},
		to_filtered_stream_paeth_interlaced: function (preprocess_levels) {
			// Filter stream
			var levels = [ [], [], [], [], [], [], [] ],
				filter_stream = [],
				filter_stream_length = 0,
				pixel_bytes = this.channels * this.bytes_per_component,
				scanline_bytes = this.width * pixel_bytes,
				ms = RawImage.interlace_matrix_size,
				level, b, i, j, x, y;

			// Create levels
			for (y = 0; y < this.height; y += 1) {
				for (x = 0; x < this.width; x += 1) {
					level = levels[RawImage.interlace_matrix[(y % ms) * ms + (x % ms)]];

					i = (x) * pixel_bytes + (y) * scanline_bytes;
					j = i + pixel_bytes;

					for (; i < j; ++i) {
						level.push(this.data[i]);
					}
				}
			}

			// Convert to buffers and get width/height
			for (i = 0; i < levels.length; ++i) {
				x = RawImage.interlace_matrix_width[i];
				y = RawImage.interlace_matrix_height[i];

				b = new Buffer(levels[i]);
				levels[i] = {
					buffer: b,
					width: Math.ceil((this.width - x[0]) / x[1]),
					height: Math.ceil((this.height - y[0]) / y[1])
				};
			}

			// Preprocess levels
			if (preprocess_levels) {
				preprocess_levels(levels);
			}

			// Encode
			for (i = 0; i < levels.length; ++i) {
				b = this.paeth_stream_create(levels[i].buffer, levels[i].width, this.channels, this.bytes_per_component);
				filter_stream.push(b);
				filter_stream_length += b.length;
			}

			// Return
			return Buffer.concat(filter_stream, filter_stream_length);
		},
		get_interlace_sizes: function () {
			var levels = [],
				i, x, y;

			for (i = 0; i < RawImage.interlace_matrix_width.length; ++i) {
				x = RawImage.interlace_matrix_width[i];
				y = RawImage.interlace_matrix_height[i];

				levels.push({
					width: Math.ceil((this.width - x[0]) / x[1]),
					height: Math.ceil((this.height - y[0]) / y[1])
				});
			}

			return levels;
		},
		paeth_stream_create: function (data, width, channels, bytes_per_component) {
			// Filter stream
			var filter_stream = [],
				filter_stream_length = 0,
				scanline_byte_length = width * channels * bytes_per_component,
				data_length = data.length,
				filter_flag = new Buffer([ 0x04 ]),
				line_pre = null,
				d, i;

			// Create stream with filter info
			for (i = 0; i < data_length; i += scanline_byte_length) {
				filter_stream_length += scanline_byte_length + 1;
				filter_stream.push(filter_flag);
				d = data.slice(i, i + scanline_byte_length);
				filter_stream.push(this.paeth_scanline(d, line_pre, channels, bytes_per_component));
				line_pre = d;
			}

			// Return
			return Buffer.concat(filter_stream, filter_stream_length);
		},
		paeth_scanline: function (buffer, pre, channels, bytes_per_component) {
			var len = buffer.length,
				new_buffer = new Buffer(len),
				pixel_byte_length = channels * bytes_per_component,
				a, b, c, i, x;

			var predictor = function (a, b, c) {
				var p = a + b - c,
					pa = Math.abs(p - a),
					pb = Math.abs(p - b),
					pc = Math.abs(p - c);

				if (pa <= pb && pa <= pc) return a;
				if (pb <= pc) return b;
				return c;
			};

			for (i = 0; i < len; ++i) {
				if (i < pixel_byte_length) {
					a = 0;
					c = 0;
					b = (pre === null) ? 0 : pre[i];
				}
				else {
					a = buffer[i - pixel_byte_length];
					if (pre === null) {
						b = 0;
						c = 0;
					}
					else {
						b = pre[i];
						c = pre[i - pixel_byte_length];
					}
				}

				x = buffer[i];
				x -= predictor(a, b, c);
				x = (x & 0xFF) >>> 0;
				new_buffer[i] = x;
			}

			return new_buffer;
		}
	};

	RawImage.interlace_matrix = [
		0, 5, 3, 5, 1, 5, 3, 5,
		6, 6, 6, 6, 6, 6, 6, 6,
		4, 5, 4, 5, 4, 5, 4, 5,
		6, 6, 6, 6, 6, 6, 6, 6,
		2, 5, 3, 5, 2, 5, 3, 5,
		6, 6, 6, 6, 6, 6, 6, 6,
		4, 5, 4, 5, 4, 5, 4, 5,
		6, 6, 6, 6, 6, 6, 6, 6
	];
	RawImage.interlace_matrix_width = [ [0,8], [4,8], [0,4], [2,4], [0,2], [1,2], [0,1] ];
	RawImage.interlace_matrix_height = [ [0,8], [0,8], [4,8], [0,4], [2,4], [0,2], [1,2] ];
	RawImage.interlace_matrix_size = 8;
	RawImage.modes = {
		blackandwhite: [ 0, ["gray","gray16be"] ],
		grayscale: [ 0, ["gray","gray16be"] ],
		rgb: [ 2, ["rgb24","rgb48be"] ],
		blackandwhite_alpha: [ 4, ["rgba","rgba64be"] ],
		grayscale_alpha: [ 4, ["rgba","rgba64be"] ],
		rgb_alpha: [ 6, ["rgba","rgba64be"] ],
	};



	// Image loading
	var load_image = (function () {

		var buffer_index_of_newline = function (buffer, start) {
			var len = buffer.length,
				v;

			while (start < len) {
				v = buffer[start];
				if (v === 10 || v === 13) return start;
				++start;
			}

			return -1;
		};

		var create_image = function (data) {
			var header_values = [],
				start = 0,
				endhdr = 0,
				values = {},
				pos, input_str,
				width, height, range, depth, mode,
				i, m;

			// Read header
			while (true) {
				pos = buffer_index_of_newline(data, start);
				input_str = data.slice(start, (pos < 0 ? undefined : pos + 2)).toString("utf8");

				if ((m = re_header.exec(input_str)) === null) {
					// Error
					return "Invalid header";
				}
				else if (m[1] !== undefined) {
					Array.prototype.push.apply(header_values, m[1].split(re_space));

					if (header_values[0] !== "P7") {
						// Error
						return "Invalid pam type";
					}

					// Find end of header
					endhdr = header_values.indexOf("ENDHDR", endhdr);
					if (endhdr < 0) {
						endhdr = header_values.length;
					}
					else {
						start += m[0].length;
						break;
					}
				}

				if (pos < 0) {
					// Error
					return "Invalid header";
				}
				start = pos + 1;
			}

			// Parse values
			for (i = 1; i < endhdr; i += 2) {
				values[header_values[i].toLowerCase()] = header_values[i + 1];
			}

			// Validation
			if (!("tupltype" in values)) {
				return "No TUPLTYPE given";
			}
			if (!((mode = values.tupltype.toLowerCase()) in RawImage.modes)) {
				return "Invalid TUPLTYPE given";
			}

			// Read values
			width = parseInt(values.width || "", 10) || 0;
			height = parseInt(values.height || "", 10) || 0;
			range = parseInt(values.maxval || "", 10) || 0;
			depth = parseInt(values.depth || "", 10) || 0;

			if (width <= 0) return "Invalid width";
			if (height <= 0) return "Invalid height";
			if (range <= 0) return "Invalid range";
			if (depth <= 0) return "Invalid depth";

			// Create
			return new RawImage(
				width,
				height,
				range,
				depth,
				mode,
				data.slice(start)
			);
		};

		var proc = function (executable, args, stdin, callback) {
			var stdout_buffers = [],
				stdout_length = 0,
				stderr_buffers = [],
				stderr_length = 0,
				p;

			// Start process
			p = child_process.spawn(executable, args, {
				stdio: [
					stdin ? "pipe" : "ignore", // stdin
					"pipe", // stdout
					"pipe" // stderr
				]
			});

			// Events
			p.stdout.on("data", function (data) {
				stdout_buffers.push(data);
				stdout_length += data.length;
			});

			p.stderr.on("data", function (data) {
				stderr_buffers.push(data);
				stderr_length += data.length;
			});

			p.on("error", function () {
				callback(null, null, 0, executable + " failed to execute");
			});

			p.on("close", function (code) {
				var stdout = Buffer.concat(stdout_buffers, stdout_length),
					stderr = Buffer.concat(stderr_buffers, stderr_length);

				callback(stdout, stderr, code, null);
			});

			// Send stdin
			if (stdin) {
				p.stdin.write(stdin);
				p.stdin.end();
			}
		};

		var re_header = /^\s*([^\r\n#]+)?(\s*#[^\r\n]*)?(?:\r\n?|\n|$)/,
			re_space = /\s+/;

		return function (source, filters, callback) {
			// Optional arguments
			if (typeof(filters) === "function") {
				callback = filters;
				filters = null;
			}

			// Args
			var filter_id = 0,
				filter_count = filters ? filters.length : 0,
				vcodec = null,
				stdin = null,
				source_original = source;

			// Process complete callback
			var cb = function (stdout, stderr, code, error) {
				if (error === null) {
					var img;

					if (code === 0) {
						// Next
						if (
							filter_id < filter_count ||
							(
								filter_id === filter_count &&
								filter_id > 0 &&
								filters[filter_id - 1].type
							)
						) {
							// Continue
							stdin = stdout;
							single();
							return;
						}

						// Process image
						img = create_image(stdout);

						if (typeof(img) === "string") {
							callback(null, "Failed to process image: " + img, stderr.toString("utf8"));
						}
						else {
							callback(img, null, null);
						}
					}
					else {
						callback(null, ffmpeg_exe + " exited with code " + code, stderr.toString("utf8"));
					}
				}
				else {
					callback(null, error, null);
				}
			};

			// Run a single filter
			var single = function () {
				// Construct arguments
				var args = [ "-hide_banner" ],
					re_substitute = /\{@SOURCE\}/g,
					f, i;

				if (vcodec !== null) {
					args.push("-vcodec", vcodec);
				}
				Array.prototype.push.apply(args, [
					"-i", source,
				]);

				if (filter_id < filter_count) {
					f = filters[filter_id];

					vcodec = f.type || "pam";

					for (i = 0; i < f.args.length; ++i) {
						args.push(f.args[i].replace(re_substitute, source_original));
					}
				}
				else {
					vcodec = "pam";
				}

				Array.prototype.push.apply(args, [
					"-an", "-sn",
					"-vcodec", vcodec,
					"-vframes", "1",
					"-f", "image2",
					"pipe:1"
				]);

				// Advance arguments
				source = "pipe:0";
				++filter_id;

				// Call
				proc(ffmpeg_exe, args, stdin, cb);
			};

			// Begin
			single();
		};

	})();



	// Argument parser
	var arguments_parse = function (args, start, descriptor, flagless_argument_order, stop_after_all_flagless, return_array) {
		// Default values
		flagless_argument_order = flagless_argument_order || [];
		stop_after_all_flagless = stop_after_all_flagless || false;
		return_array = return_array || false;

		// Setup data
		var argument_values = {},
			argument_aliases_short = {},
			argument_aliases_long = {},
			errors = [],
			repr = JSON.stringify,
			i, k, v;

		for (k in descriptor) {
			v = descriptor[k];
			if ("bool" in v && v.bool === true) {
				argument_values[k] = false;
			}
			else {
				argument_values[k] = null;
			}

			if ("short" in v) {
				for (i = 0; i < v.short.length; ++i) {
					argument_aliases_short[v.short[i]] = k;
				}
			}

			if ("long" in v) {
				for (i = 0; i < v.long.length; ++i) {
					argument_aliases_long[v.long[i]] = k;
				}
			}
		}

		// Parse command line
		var end = args.length,
			arg, arg_key, arg_len;

		while (start < end) {
			// Check
			arg = args[start];
			if (arg.length > 0 && arg[0] == "-") {
				if (arg.length == 1) {
					// Single "-"
					errors.push("Invalid argument " + repr(arg));
				}
				else {
					if (arg[1] == "-") {
						// Long argument
						arg = arg.substr(2);
						if (arg in argument_aliases_long) {
							// Set
							arg_key = argument_aliases_long[arg];
							if (argument_values[arg_key] === false || argument_values[arg_key] === true) {
								// No value
								argument_values[arg_key] = true;
							}
							else {
								if (start + 1 < end) {
									// Value
									++start;
									argument_values[arg_key] = args[start];
								}
								else {
									// Invalid
									errors.push("No value specified for flag " + repr(arg));
								}
							}

							// Remove from flagless_argument_order
							for (i = 0; i < flagless_argument_order.length; ++i) {
								if (flagless_argument_order[i] == arg_key) {
									flagless_argument_order.splice(i, 1);
									break;
								}
							}
						}
						else {
							// Invalid
							errors.push("Invalid long flag " + repr(arg));
						}
					}
					else {
						// Short argument(s)
						arg = arg.substr(1);
						arg_len = arg.length;
						for (i = 0; i < arg_len; ++i) {
							if (arg[i] in argument_aliases_short) {
								// Set
								arg_key = argument_aliases_short[arg[i]];
								if (argument_values[arg_key] === false || argument_values[arg_key] === true) {
									// No value
									argument_values[arg_key] = true;
								}
								else {
									if (i + 1 < arg_len) {
										// Trailing value
										argument_values[arg_key] = arg.substr(i + 1);
									}
									else if (start + 1 < end) {
										// Value
										++start;
										argument_values[arg_key] = args[start];
									}
									else {
										// Invalid
										errors.push("No value specified for flag " + repr(arg));
									}
									break; // Terminate loop
								}

								// Remove from flagless_argument_order
								for (i = 0; i < flagless_argument_order.length; ++i) {
									if (flagless_argument_order[i] == arg_key) {
										flagless_argument_order.splice(i, 1);
										break;
									}
								}
							}
							else {
								// Invalid
								errors.push("Invalid short flag " + repr(arg[i]) + ((arg_len == 1) ? "" : " in " + repr(arg)));
							}
						}
					}
				}
			}
			else if (flagless_argument_order.length > 0) {
				// Set
				arg_key = flagless_argument_order[0];
				if (argument_values[arg_key] === false || argument_values[arg_key] === true) {
					// No value
					argument_values[arg_key] = true;
				}
				else {
					// Value
					argument_values[arg_key] = arg;
				}

				// Remove from flagless_argument_order
				flagless_argument_order.splice(0, 1);
			}
			else {
				// Invalid
				errors.push("Invalid argument " + repr(arg));
			}

			// Next
			++start;
			if (stop_after_all_flagless && flagless_argument_order.length === 0) break; // The rest are ignored
		}



		// Return
		if (return_array) {
			return [ argument_values , errors , flagless_argument_order , start ];
		}
		else {
			return argument_values;
		}
	};

	// Usage info
	var usage = function (arguments_descriptor, stream) {
		var usage_info = [
			"Usage:",
			"    " + path.basename(process.execPath) + " " + path.basename(process.argv[1]) + " input output size [mode] <options>",
			"\n",
			"Available flags:",
		];

		// Flags
		var argument_keys = Object.keys(arguments_descriptor),
			i, j, key, arg, line, param_name;

		for (i = 0; i < argument_keys.length; ++i) {
			key = argument_keys[i];
			arg = arguments_descriptor[key];
			param_name = "";
			if (!arg.bool) {
				param_name = " <" + ("argument" in arg ? arg.argument : "value") + ">";
			}

			if (i > 0) usage_info.push("");

			if ("long" in arg) {
				for (j = 0; j < arg.long.length; ++j) {
					usage_info.push("  --" + arg.long[j] + param_name);
				}
			}

			if ("short" in arg) {
				line = [ "  " ];
				for (j = 0; j < arg.short.length; ++j) {
					if (j > 0) line.push(", ");
					line.push("-" + arg.short[j] + param_name);
				}
				usage_info.push(line.join(""));
			}

			if ("description" in arg) {
				usage_info.push("    " + arg.description);
			}
		}

		// More info
		//Array.prototype.push.apply(usage_info, [ "\n", ]);

		// Output
		stream.write(usage_info.join("\n") + "\n");
	};

	// Version info
	var show_version_info = function () {
		var version_string = "Version ",
			i;

		for (i = 0; i < version_info.length; ++i) {
			if (i > 0) version_string += ".";
			version_string += version_info[i];
		}
		process.stdout.write(version_string + "\n");
	};

	// Main
	var main = function () {
		// Command line arguments
		var arguments_descriptor = {
			"version": {
				"short": [ "v" ],
				"long": [ "version" ],
				"bool": true,
				"description": "Show version info and exit",
			},
			"help": {
				"short": [ "h" , "?" ],
				"long": [ "help" , "usage" ],
				"bool": true,
				"description": "Show usage info and exit",
			},
			"input": {
				"short": [ "i" ],
				"long": [ "input" ],
				"argument": "path",
				"description": "The input image to read",
			},
			"output": {
				"short": [ "o" ],
				"long": [ "output" ],
				"argument": "path",
				"description": "The output png filename",
			},
			"size": {
				"short": [ "s" ],
				"long": [ "size" ],
				"argument": "bytes",
				"description": "The number of bytes to target; examples: 2097152, 2048k, 2m",
			},
			"small": {
				"long": [ "small" ],
				"argument": "path",
				"description": "A small image to use as a \"fake\" interlaced mode image",
			},
			"small_opacity": {
				"long": [ "small-opacity" ],
				"argument": "value",
				"description": "How opaque the small image should be; in the range of [0, 1]; 1 is fully visible",
			},
			"mode": {
				"short": [ "m" ],
				"long": [ "mode" ],
				"argument": "mode",
				"description": "Which mode to use; can be \"idat\" or \"deflate\"; default is \"idat\"",
			},
			"interlaced": {
				"long": [ "interlaced" ],
				"bool": true,
				"description": "Output pngs in interlaced mode; if a small image is specified, interlaced mode is implicitly enabled",
			},
			"filters": {
				"short": [ "f" ],
				"long": [ "filters" ],
				"bool": true,
				"description": "Enables the filter chain",
			},
			"ffmpeg": {
				"short": [ "e" ],
				"long": [ "ffmpeg", "exe" ],
				"argument": "exe_path",
				"description": "Path to the ffmpeg executable",
			},
			"firefox_bug": {
				"long": [ "firefox-bug" ],
				"bool": true,
				"description": "Enables a bug in Firefox that makes images created in \"idat\" mode fail to render",
			}
		};
		var arg_data = arguments_parse(process.argv, 2, arguments_descriptor, [ "input" , "output" , "size" , "mode" ], false, true),
			args = arg_data[0],
			i, s;

		// Parsing errors
		if (arg_data[1].length > 0) {
			for (i = 0; i < arg_data[1].length; ++i) {
				process.stderr.write(arg_data[1][i] + "\n");
			}
			process.exit(-1);
			return;
		}

		// Version
		if (args.version) {
			show_version_info();
			process.exit(0);
			return;
		}

		// Usage
		if (args.help) {
			usage(arguments_descriptor, process.stdout);
			process.exit(0);
			return;
		}

		// Missing arguments
		if (args.input === null || args.output === null || args.size === null) {
			usage(arguments_descriptor, process.stderr);
			process.exit(1);
			return;
		}



		// Arguments
		var input = args.input,
			output = args.output,
			small = args.small,
			settings = {
				mode: bloat_image.MODE_EXTRA_IDAT_SECTIONS,
				interlaced: args.interlaced || (args.small !== null),
				compress_whenever_possible: true,
				small: null,
				small_opacity: (args.small_opacity === null ? 0.5 : parseFloat(args.small_opacity) || 0.0),
				firefox_bug: args.firefox_bug
			},
			target_size, filters;

		// Mode
		if (args.mode !== null) {
			s = args.mode.trim().toLowerCase();
			if ([ "deflate" ].indexOf(s) >= 0) {
				args.mode = bloat_image.MODE_EXTRA_DEFLATES;
			}
		}

		// Size
		target_size = parse_size(args.size);
		if (target_size === null || target_size <= 0) {
			process.stderr.write("Invalid target size\n");
			process.exit(-1);
			return;
		}

		// ffmpeg
		if (args.ffmpeg !== null) {
			ffmpeg_exe = args.ffmpeg;
		}

		// Filters
		filters = [];
		if (args.filters) {
			filters = [
				{
					type: "mjpeg",
					args: [
						"-vf", "curves=all=0.25/0.1 0.375/0.4 0.625/0.6 0.75/0.9",
						"-q:v", "10"
					]
				},
				{
					type: null,
					args: [
						"-i", "{@SOURCE}",
						"-filter_complex", "[1:v] format=rgba, extractplanes=a [alpha]; [0:v][alpha] alphamerge",
					]
				}
			];
		}


		// Load
		load_image(input, filters, function (image, error, stderr) {
			if (image === null) {
				// Error
				process.stderr.write(error + "\n");
				if (stderr) {
					process.stderr.write(stderr + "\n");
				}
				process.exit(-2);
			}
			else {
				// Normalize
				image.normalize();

				// Small image callback
				var on_small_image = function (image_small, error) {
					// Process
					settings.small = image_small;
					error = bloat_image(image, output, target_size, settings);
					if (error === null) {
						// Okay
						process.exit(0);
					}
					else {
						// Error
						process.stderr.write("Image bloating failed: " + error + "\n");
						process.exit(-3);
					}
				};

				// Load the small "false" image
				if (small) {
					var size = image.get_interlace_sizes()[0];
					load_image(small, [{
						type: null,
						args: [
							"-vf", "format=" + image.get_ffmpeg_colorspace() + ", scale=" + size.width + ":" + size.height,
						]
					}], on_small_image);
				}
				else {
					on_small_image(null, null, null);
				}
			}
		});
	};



	// Execute
	if (require.main === module) main();

})();


