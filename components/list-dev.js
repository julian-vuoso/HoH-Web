Vue.component('dev-btn', {
  props: {
    device: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      selected: false
    }
  },
  template:
    `<v-col class="text-center">
      <v-btn class="mb-1" :outlined="!selected" :width="getSize" :height="getSize" fab color="grey darken-4" @click="toggleSelected">
        <div>
          <v-img eager :max-width="getIconSize" :src="getImg" contain/>
        </div>
      </v-btn>
      <div class="text-capitalize black--text font-weight-light mb-1">
        {{ device.name }}
      </div>
    </v-col>`,
  computed: {
    getSize() {
      return screen.width / 13; // ver si da limitarlo con max y min
    },
    getIconSize() {
      if (this.device.type.name === "refrigerator" || this.device.type.name === "door") return this.getSize / 3;
      return this.getSize / 2;
    },
    getName() {
      return this.device.name; // aca ver de poner max y min caracteres
    },
    getImg() {
      let stat = this.device.state.status;
      switch (this.device.type.name) {
        case "lamp":
          if (stat === "on")
            return './resources/icons/web/lamp_on.svg';
          else
            return './resources/icons/web/lamp_off.svg';
        case "vacuum":
          if (stat === "on")
            return './resources/icons/web/vacuum_on.svg';
          else
            return './resources/icons/web/vacuum_off.svg';
        case "ac":
          if (stat === "on")
            return './resources/icons/web/air_conditioner_on.svg';
          else
            return './resources/icons/web/air_conditioner_off.svg';
        case "door":
          if (stat === "closed")
            return './resources/icons/web/door_closed.svg';
          else {
            if (stat === "opened")
              return './resources/icons/web/door_opened.svg'; // NO EXISTS
            else
              return './resources/icons/web/door_locked.svg'; // NO EXISTS
          }
        case "blinds":
          if (stat === "closed")
            return './resources/icons/web/window_closed.svg';
          else
            return './resources/icons/web/window_open.svg';
        case "speaker":
          if (stat === "playing")
            return './resources/icons/web/speaker_playing.svg';
          else
            return './resources/icons/web/speaker_off.svg';
        case "oven":
          if (stat === "on")
            return './resources/icons/web/oven_on.svg';
          else
            return './resources/icons/web/oven_off.svg';
        case "refrigerator":
          return "./resources/icons/web/fridge.svg";
        default:
          return './resources/icons/generic/close.svg';
      }
    },
  },
  methods: {
    updateDev(device) {
      this.device.state.status = device.state.status;
      this.device.name = device.name;
    },
    toggleSelected() {
      this.selected = !this.selected;
      console.log(this.device);
      if (this.selected) {
        this.$root.$emit('Device Selected', this.device);
      } else {
        this.$root.$emit('Device Deselected');
      }
    },
    async getData() {
      let rta = await getDevice(this.device.id)
        .catch((error) => {
          this.errorMsg = error[0].toUpperCase() + error.slice(1);
          console.error(this.errorMsg);
        });
      if (rta) {
        console.log(rta.result);
        this.updateDev(rta.result);
      } else {
        this.error = true;
      }
    }
  },
  async mounted() {
    this.$root.$on('Device Selected', (device) => {
      if (this.selected && device.id != this.device.id) this.selected = !this.selected;
    });
    this.getData();
    let timer = setInterval(() => this.getData(), 1000);
  }
})

Vue.component('dev-cat', {
  props: {
    room: {
      type: Object,
      required: true
    },
    devices: {
      type: Array,
      required: true
    }
  },
  template:
    `<v-container>
      <v-row>
        <div class="title grey--text text-capitalize mt-4 ml-5">{{ room.name }}</div>
      </v-row>
      <v-row >
        <div v-for="dev in devices" :key="dev.id">
          <v-col v-if="dev.room.id === room.id" cols="auto">
            <dev-btn :device="dev"></dev-btn>
          </v-col>
        </div>
      </v-row>
    </v-container>`
})

Vue.component('room-cat', {
  props: {
    devices: {
      type: Array,
      required: true
    },
    category: {
      type: String,
      required: true
    }
  },
  data() {
    return {
    }
  },
  template:
    ` <v-container>
        <v-row>
          <div class="title grey--text mt-4 ml-5">{{category}}</div>
        </v-row>
        <v-row>
          <v-col v-for="dev in devices" :key="dev.id" cols="auto">
            <dev-btn :device="dev"></dev-btn>
          </v-col>
        </v-row>
      </v-container>`,
  mounted() {
  }
})